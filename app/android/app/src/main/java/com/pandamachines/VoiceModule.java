package com.pandamachines;

import android.app.Activity;
import android.content.Intent;
import android.speech.RecognizerIntent;
import com.facebook.react.bridge.BaseActivityEventListener;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.ArrayList;
import java.util.Locale;

public class VoiceModule extends ReactContextBaseJavaModule {
  private static final int VOICE_REQUEST_CODE = 1001;

  public VoiceModule(ReactApplicationContext reactContext) {
    super(reactContext);
    reactContext.addActivityEventListener(mActivityEventListener);
  }

  @Override
  public String getName() {
    return "VoiceModule";
  }

  private final BaseActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
      if (requestCode == VOICE_REQUEST_CODE && resultCode == Activity.RESULT_OK && data != null) {
        ArrayList<String> results = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
        if (results != null && !results.isEmpty()) {
          sendEvent("VoiceResult", "result", results.get(0));
        }
      } else if (resultCode == Activity.RESULT_CANCELED) {
        sendEvent("VoiceError", "error", "Voice recognition cancelled");
      }
    }
  };

  @ReactMethod
  public void startVoiceRecognition(String prompt, String language) {
    try {
      Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
      intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
      intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, language != null ? language : Locale.getDefault().toString());
      intent.putExtra(RecognizerIntent.EXTRA_PROMPT, prompt != null ? prompt : "Speak now");
      intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1);

      Activity activity = getCurrentActivity();
      if (activity != null) {
        activity.startActivityForResult(intent, VOICE_REQUEST_CODE);
      }
    } catch (Exception e) {
      sendEvent("VoiceError", "error", e.getMessage());
    }
  }

  @ReactMethod
  public void stopVoiceRecognition() {
    // Android handles this automatically
  }

  @ReactMethod
  public void cancelVoiceRecognition() {
    // Android handles this automatically
  }

  private void sendEvent(String eventName, String key, String value) {
    WritableMap map = Arguments.createMap();
    map.putString(key, value);
    getReactApplicationContext()
      .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
      .emit(eventName, map);
  }
}
