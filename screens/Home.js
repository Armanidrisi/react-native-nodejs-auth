import React, { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import * as SecureStore from "expo-secure-store";

const Home = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        setIsLoggedIn(true);
        fetchUserProfile(token);
      } else {
        setIsLoggedIn(false);
        navigation.replace("Login");
      }
    } catch (error) {
      alert("Error reading token from SecureStore:", error);
    }
  };

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch("http://localhost:3000/auth/profile", {
        headers: {
          Authorization: `${token}`,
        },
      });
      const userData = await response.json();
      setUserProfile(userData);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await SecureStore.deleteItemAsync("token");
      setIsLoggedIn(false);
      navigation.replace("Login");
    } catch (error) {
      console.error("Error removing token from SecureStore:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {isLoggedIn ? (
        <View>
          <Text style={{ fontSize: 20, marginBottom: 20 }}>
            User is logged in
          </Text>
          {userProfile && (
            <View>
              <Text>Username: {userProfile.username}</Text>
              <Text>Email: {userProfile.email}</Text>
            </View>
          )}
          <Button title="Logout" onPress={handleLogout} style={{ marginTop: 10 }} />
        </View>
      ) : (
        <Text style={{ fontSize: 20, marginBottom: 20 }}>User is logged out</Text>
      )}
    </View>
  );
};

export default Home;
