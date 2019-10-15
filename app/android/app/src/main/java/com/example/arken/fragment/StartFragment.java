package com.example.arken.fragment;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;
import androidx.navigation.fragment.NavHostFragment;

import com.example.arken.R;
import com.example.arken.activity.MainActivity;
import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.SignInButton;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;

import static android.content.ContentValues.TAG;

public class StartFragment extends Fragment implements View.OnClickListener {
    private Button loginButton;
    private Button signUpButton;
    private Button guestButton;
    private SignInButton signupGoogle;
    private static final int RC_SIGN_IN = 2;
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_start, container, false);
        loginButton = view.findViewById(R.id.start_login_button);
        signUpButton = view.findViewById(R.id.start_signup_button);
        guestButton = view.findViewById(R.id.signup_guest_button);
        guestButton.setOnClickListener(this);
        loginButton.setOnClickListener(this);
        signUpButton.setOnClickListener(this);
        signupGoogle = view.findViewById(R.id.signin_google_button);
        signupGoogle.setOnClickListener(this);
        return view;
    }

    @Override
    public void onClick(View view) {
        if(view.getId() == R.id.start_login_button){
            Navigation.findNavController(view).navigate(R.id.action_startFragment_to_loginFragment);
        } else if(view.getId() == R.id.start_signup_button){
            Navigation.findNavController(view).navigate(R.id.action_startFragment_to_signupFragment);
        } else if (view.getId() == R.id.signup_guest_button) {
            Navigation.findNavController(view).navigate(R.id.action_startFragment_to_listEventFragment);
        } else if (view.getId() == R.id.signin_google_button){
            signIn();
        }
    }
    private void signIn() {
        Intent signInIntent = MainActivity.getClient().getSignInIntent();
        startActivityForResult(signInIntent, RC_SIGN_IN);
    }
    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == Activity.RESULT_OK) {
            switch (requestCode) {
                case RC_SIGN_IN:
                    try {
                        // The Task returned from this call is always completed, no need to attach
                        // a listener.
                        Task<GoogleSignInAccount> task = GoogleSignIn.getSignedInAccountFromIntent(data);
                        GoogleSignInAccount account = task.getResult(ApiException.class);
                        onLoggedIn(account);
                    } catch (ApiException e) {
                        // The ApiException status code indicates the detailed failure reason.
                        Log.w(TAG, "signInResult:failed code=" + e.getStatusCode());
                    }
                    break;
            }
        }
    }
    private void onLoggedIn(GoogleSignInAccount googleSignInAccount) {
        NavHostFragment.findNavController(this).navigate(R.id.action_signupFragment_to_listEventFragment);
        Toast.makeText(getContext(), "Register page", Toast.LENGTH_SHORT).show();
    }
    @Override
    public void onStart() {
        super.onStart();
        GoogleSignInAccount alreadyloggedAccount = GoogleSignIn.getLastSignedInAccount(getContext());
        if (alreadyloggedAccount != null) {
            onLoggedIn(alreadyloggedAccount);
            Toast.makeText(getContext(), "Already Logged In", Toast.LENGTH_SHORT).show();
        } else {
            Log.d(TAG, "Not logged in");
        }
    }
}
