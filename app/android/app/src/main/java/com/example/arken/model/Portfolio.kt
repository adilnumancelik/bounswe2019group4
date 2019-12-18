package com.example.arken.model

import java.io.Serializable

class Portfolio(
    val _id: String?,
    val title:String,
    val definition: String,
    val isPrivate: Boolean,
    val tradingEqs: List<String>?
) : Serializable