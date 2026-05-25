import { Select } from "antd";
import { type FC } from "react";
import { useChains, useSwitchChain } from "wagmi";

const SwitchChain: FC= () => {

    const switchChain = useSwitchChain()
    const chains = useChains()
    
    return(
        <Select
            placeholder="Select network"
            style={{ width: 180 }}    
            options={chains.map((chain) => ({
                label: chain.name,
                value: chain.id
            }))}
            onChange={(chainId)=>switchChain.mutate({chainId: chainId})}
        />
    )
}

export default SwitchChain