package com.example.arken.model

import java.io.Serializable

class Profile(
    val user:User?,
    val following:Int?,
    val follower:Int?,
    val followStatus:Boolean?,
    val followRequest:Int?,
    val followRequests:MutableList<User>
) : Serializable