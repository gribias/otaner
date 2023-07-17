import React from 'react'
import {Button} from "@mui/material";
import { CustomButtonEdditProps } from 'interfaces/common'

export const CustomButtonEddit = ({type, title,
backgroundColor, color, fullWidth, icon, handleEdit, disabled}:CustomButtonEdditProps
) => {
  return (
    <Button
    disabled = {disabled}
    type = {type === 'submit' ? 'submit' : 'button' }
    sx={{
        flex: fullWidth ? 1 : 'unset',
        padding: '10px 15px',
        width: fullWidth ? '100%':
        'fit-content',
        minWidth: 130,
        backgroundColor,
        color,
        fontSize: 16,
        fontWeight: 600,
        gap: '10px',
        textTransform: 'capitalize',
        '&:hover':{
            opacity: 0.9,
            backgroundColor
        }
    }}
    onClick = {handleEdit}
    >
        {icon}
        {title}
       
    </Button>
  )
}
