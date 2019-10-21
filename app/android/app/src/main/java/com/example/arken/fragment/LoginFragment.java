package com.example.arken.fragment;

import android.annotation.SuppressLint;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.InputType;
import android.text.method.HideReturnsTransformationMethod;
import android.text.method.PasswordTransformationMethod;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;
import androidx.navigation.Navigation;

import com.example.arken.R;
import com.example.arken.model.LoginUser;
import com.example.arken.util.RetroClient;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import static android.content.Context.MODE_PRIVATE;

public class LoginFragment extends Fragment implements View.OnClickListener {
    LinearLayout signupButton;
    EditText emailEditText;
    EditText passwordEditText;
    Button loginButton;
    Button guestButton;
    ImageView passwordEyeImage;
    public static final String MY_PREFS_NAME = "MyPrefsFile";

    @SuppressLint("ClickableViewAccessibility")
    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_login, container, false);
        guestButton = view.findViewById(R.id.signup_guest_button);
        guestButton.setOnClickListener(this);
        signupButton = view.findViewById(R.id.login_signupButton_layout);
        signupButton.setOnClickListener(this);
        loginButton = view.findViewById(R.id.login_login_button);
        loginButton.setOnClickListener(this);
        emailEditText = view.findViewById(R.id.login_email_editText);
        passwordEditText = view.findViewById(R.id.login_password_editText);
        ConstraintLayout layout = view.findViewById(R.id.login_background);
        layout.setOnClickListener(this);
        passwordEyeImage = view.findViewById(R.id.login_password_eye_image);
        passwordEyeImage.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View view, MotionEvent motionEvent) {
                switch(motionEvent.getAction()){
                    case MotionEvent.ACTION_DOWN:
                        passwordEditText.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                        return true;
                    case MotionEvent.ACTION_UP:
                        passwordEditText.setTransformationMethod(PasswordTransformationMethod.getInstance());

                        return true;
                    default:
                        return false;

                }
            }
        });
        return view;
    }


    @Override
    public void onClick(View view) {
        if(view.getId()!=R.id.login_email_editText && view.getId()!=R.id.login_password_editText){
            InputMethodManager inputMethodManager = (InputMethodManager)getActivity().getSystemService(Context.INPUT_METHOD_SERVICE);
            inputMethodManager.hideSoftInputFromWindow(view.getWindowToken(), 0);

        }
        if(view.getId() == R.id.login_signupButton_layout){
            Navigation.findNavController(view).navigate(R.id.action_loginFragment_to_signupFragment);

        } else if (view.getId() == R.id.signup_guest_button) {
            Navigation.findNavController(view).navigate(R.id.action_loginFragment_to_baseFragment);
        }
        else if(view.getId() == R.id.login_login_button){
            if(emailEditText.getText().toString().trim().equals("")){
                emailEditText.setError("Please enter your email");
                return;
            }
            if(passwordEditText.getText().toString().trim().equals("")){
                passwordEditText.setError("Please enter your password");
                return;
            }

            final String email = String.valueOf(emailEditText.getText());
            String password = String.valueOf(passwordEditText.getText());

            Call<ResponseBody> call = RetroClient.getInstance().getAPIService().login(new LoginUser(email, password));

            call.enqueue(new Callback<ResponseBody>() {
                @Override
                public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                    if (response.isSuccessful()) {
                        SharedPreferences.Editor editor = getActivity().getSharedPreferences(MY_PREFS_NAME, MODE_PRIVATE).edit();
                        editor.putString("email", email);
                        editor.apply();
                        Navigation.findNavController(signupButton).navigate(R.id.action_loginFragment_to_baseFragment);
                    } else {
                        Toast.makeText(getContext(), response.raw().toString(), Toast.LENGTH_SHORT).show();
                    }
                }

                @Override
                public void onFailure(Call<ResponseBody> call, Throwable t) {
                    Toast.makeText(getContext(),t.getMessage(), Toast.LENGTH_SHORT ).show();
                }
            });
        }
    }
}
