import React, { useEffect } from 'react'
import { useRecoilValue, useRecoilState } from 'recoil'
import { directoryMenuState } from '../atoms/directoryMenuAtom'
import { useNavigate } from "react-router-dom"
import { FaReddit } from 'react-icons/fa'
import { communityState } from '../atoms/communitiesAtom'

export default function useDirectory() {

    const [directoryState, setDirectoryState] = useRecoilState(directoryMenuState)
    const navigate = useNavigate()
    const communityStateValue = useRecoilValue(communityState)

    const toggleMenuOpen = () => {
        setDirectoryState(prev => ({
            ...prev,
            isOpen: !directoryState.isOpen
        }))
    }

    const onSelectMenuItem = (menuItem) => {
        setDirectoryState(prev => ({
            ...prev,
            selectedMenuItem: menuItem
        }))
        navigate(menuItem.link)
        if(directoryState.isOpen){
            toggleMenuOpen()
        }
    }

    useEffect(() => {

        const { currentCommunity } = communityStateValue

        if(currentCommunity){
            setDirectoryState(prev  => ({
                ...prev,
                selectedMenuItem: {
                    displayText: `r/${currentCommunity.id}`,
                    link: `/r/${currentCommunity.id}`,
                    imageURL: currentCommunity.imageURL,
                    icon: FaReddit,
                    iconColor: "blue.500"
                }
            }))
        }

    }, [communityStateValue.currentCommunity])

  return {directoryState, toggleMenuOpen, onSelectMenuItem}
}
