package com.example.arken.activity;

import android.os.Bundle;

import androidx.fragment.app.FragmentActivity;

import com.example.arken.R;

public class MainActivity extends FragmentActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        //    StartFragment nextFrag= new StartFragment();
        //    getSupportFragmentManager().beginTransaction()
        //            .replace(R.id.root_layout, nextFrag, "findThisFragment")
        //            .commit();
    }

}
