import {MenuButton, MenuInput} from "./StyledHeaderComponents";
import React from "react";

const GuestComponent= ()=>{
    return (  <div style={{display: "flex"}}>

        <MenuInput
                placeholder="username"
            />
            <MenuInput
                placeholder="password"
                type={"password"}
            />

            <div style={{display:"flex", flexDirection: "column", justifyContent: "center"}}>
                <MenuButton>
                    Login
                </MenuButton>
                <hr/>
                <MenuButton>
                    Sign Up
                </MenuButton>
            </div>

        </div>
    )
}

export default GuestComponent
