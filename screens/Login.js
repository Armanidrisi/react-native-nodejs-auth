import React, { useState } from "react";
import {
  Text,
  View,
  SafeAreaView,
  Image,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Formik } from "formik";
import * as yup from "yup";
import * as SecureStore from "expo-secure-store";

const validationSchema = yup.object().shape({
  username: yup
    .string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters"),
  password: yup.string().required("Password is required"),
});

export default function Login({ navigation }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (values, { resetForm, setErrors, setTouched }) => {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      setIsLoading(false);
      if (data.status) {
        await SecureStore.setItemAsync("token", data.token);
        navigation.replace("Home");
      } else {
        alert(data.message);
      }
    } catch (e) {
      setIsLoading(false);
      alert(e);
    }

    resetForm();
    setErrors({});
    setTouched({});
  };

  const renderFormInput = (label, fieldProps) => {
    const { handleChange, handleBlur, values, errors, touched } = fieldProps;
    const isError = errors[label] && touched[label];
    return (
      <View style={{ marginTop: 10 }}>
        <TextInput
          style={{
            backgroundColor: isError ? "#FFCDD2" : "#F5F5F5",
            color: "#000000",
            width: "100%",
            padding: 15,
            fontSize: 18,
            borderRadius: 8,
            borderColor: isError ? "red" : "#ccc",
            borderWidth: 1,
          }}
          placeholder={label.charAt(0).toUpperCase() + label.slice(1)}
          onChangeText={handleChange(label)}
          onBlur={handleBlur(label)}
          value={values[label]}
        />
        {isError && <Text style={{ color: "red" }}>{errors[label]}</Text>}
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <View
          style={{
            flex: 1,
            alignItems: "center",
            backgroundColor: "white",
            marginTop: 50,
          }}
        >
          <Image
            source={require("../assets/authen.png")}
            style={{ width: 290, height: 290 }}
          />
          <Text style={{ fontWeight: "900", fontSize: 28 }}>Login</Text>

          <Formik
            initialValues={{ username: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {(fieldProps) => (
              <View
                style={{ marginTop: 10, paddingHorizontal: 20, width: "100%" }}
              >
                {renderFormInput("username", fieldProps)}
                {renderFormInput("password", fieldProps)}

                <TouchableOpacity
                  style={{
                    backgroundColor: "#33A1C9",
                    width: "100%",
                    padding: 15,
                    fontSize: 18,
                    borderRadius: 8,
                    marginTop: 10,
                  }}
                  onPress={fieldProps.handleSubmit}
                >
                  <Text style={{ textAlign: "center", color: "#fff" }}>
                    Login
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>

          <Modal visible={isLoading} transparent={true} animationType="slide">
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            >
              <View
                style={{
                  width: 200,
                  height: 200,
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={{ marginTop: 10, fontSize: 16 }}>Loading...</Text>
              </View>
            </View>
          </Modal>

          <View style={{ marginTop: 10, flexDirection: "row", gap: 3 }}>
            <Text
              style={{
                fontWeight: "bold",
                marginVertical: 3,
                textAlign: "right",
              }}
            >
              New user?
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                color: "blue",
                marginVertical: 3,
                textAlign: "right",
              }}
              onPress={() => navigation.navigate("Signup")}
            >
              Register
            </Text>
          </View>
        </View>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}
