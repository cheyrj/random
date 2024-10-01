import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, StyleSheet, Button, Alert, View, StatusBar } from 'react-native';
import OTPublishersNativeSDK from 'react-native-onetrust-cmp'; // Ensure correct import

class OneTrustEventListener {
  init() {
    console.log('Initializing OneTrust SDK:', OTPublishersNativeSDK); // Log SDK to check if it's correctly imported

    if (!OTPublishersNativeSDK || !OTPublishersNativeSDK.startSDK) {
      console.error('OneTrust SDK is not properly linked or initialized.');
      return;
    }

    const cdn_location = 'cdn.cookielaw.org';
    const ot_db = '018defcb-ff07-7327-9353-05f79627a449-test';

    OTPublishersNativeSDK.startSDK(cdn_location, ot_db, 'en', {}, false)
      .then((responseObject) => {
        console.info(`OneTrust SDK initialized. Status: ${responseObject.status}`);
        this.checkBannerVisibility(); // Delay banner check until after SDK is initialized
      })
      .catch((error) => {
        console.error(`OneTrust download failed with error: ${error}`);
      });
  }

  async checkBannerVisibility() {
    console.log('Checking if banner should be shown...');
    if (!OTPublishersNativeSDK || !OTPublishersNativeSDK.shouldShowBanner) {
      console.error('OneTrust SDK is not properly linked or initialized.');
      return false;
    }

    try {
      const result = await OTPublishersNativeSDK.shouldShowBanner();
      console.log('Should the banner be shown?', result);
      return result;
    } catch (error) {
      console.error('Error checking banner visibility:', error);
      return false;
    }
  }
}

const App = () => {
  const [bannerVisible, setBannerVisible] = useState(false);

  useEffect(() => {
    const oneTrustListener = new OneTrustEventListener();
    oneTrustListener.init();

    // Check if the banner should be shown after a delay to ensure initialization
    setTimeout(() => {
      oneTrustListener.checkBannerVisibility().then((shouldShow) => {
        if (shouldShow) {
          OTPublishersNativeSDK.showBannerUI();
          setBannerVisible(true);
        } else {
          console.log('Banner should not be shown.');
          setBannerVisible(false);
        }
      });
    }, 2000); // Adjust the delay to give time for proper initialization
  }, []);

  const handleShowBanner = () => {
    OTPublishersNativeSDK.showBannerUI();
  };

  const handleShowPreferenceCenter = () => {
    OTPublishersNativeSDK.showPreferenceCenterUI();
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <Text style={styles.welcomeText}>Welcome to My App!</Text>
      <Text style={styles.instructions}>
        OneTrust SDK integration example. {bannerVisible ? 'Banner is visible.' : 'Banner is not visible.'}
      </Text>
      <View style={styles.buttonContainer}>
        <View style={styles.button}>
          <Button 
            title="Show Consent Banner" 
            color="#ffffff"
            onPress={handleShowBanner}
          />
        </View>
        
        <View style={styles.button}>
          <Button 
            title="Open Preference Center" 
            color="#ffffff"
            onPress={handleShowPreferenceCenter}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212', // Dark background
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  button: {
    backgroundColor: '#1f1f1f', // Dark button background
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff', // Light text color
    textAlign: 'center',
    marginTop: 30,
  },
  instructions: {
    fontSize: 16,
    color: '#b3b3b3', // Lighter gray for instructions
    textAlign: 'center',
    marginTop: 10,
  },
});

export default App;
