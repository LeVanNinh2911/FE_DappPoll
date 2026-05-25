/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios"

export interface ImportedCandidate {
  name: string
  description: string
  image: string
  errors?: string[]
}

export interface ImportedPosition {
  positionName: string
  positionDescription: string,
  positionVoteType: number,
  candidates: ImportedCandidate[]
}

interface ImportExcelResponse {
  success: boolean
  totalPositions?: number
  totalCandidates?: number
  data?: ImportedPosition[]
  message?: string
  warnings?: string[]
  confidence?: number
  detectedSheet?: string
  detectedHeaderRow?: number
  detectedColumns?: Record<string, string>
}

export const importCandidatesFromExcel = async (
  file: File
): Promise<{
  success: boolean
  positions: ImportedPosition[]
  totalPositions?: number
  totalCandidates?: number
  message?: string
  warnings?: string[]
  confidence?: number
  detectedSheet?: string
  detectedHeaderRow?: number
  detectedColumns?: Record<string, string>
}> => {
  const formData = new FormData()
  formData.append("file", file)

  try {
    const response = await axios.post<ImportExcelResponse>(
      `http://localhost:5000/api/ai/import-excel`,
      formData
    )

    return {
      success: response.data.success,
      positions: response.data.data || [],
      totalPositions: response.data.totalPositions,
      totalCandidates: response.data.totalCandidates,
      message: response.data.message,
      warnings: response.data.warnings,
      confidence: response.data.confidence,
      detectedSheet: response.data.detectedSheet,
      detectedHeaderRow: response.data.detectedHeaderRow,
      detectedColumns: response.data.detectedColumns
    }
  } catch (error: any) {
    if (error?.response?.data) {
      return {
        success: false,
        positions: [],
        totalPositions: 0,
        totalCandidates: 0,
        message: error.response.data.message,
        warnings: error.response.data.warnings,
        confidence: error.response.data.confidence,
        detectedSheet: error.response.data.detectedSheet,
        detectedHeaderRow: error.response.data.detectedHeaderRow,
        detectedColumns: error.response.data.detectedColumns
      }
    }

    throw error
  }
}