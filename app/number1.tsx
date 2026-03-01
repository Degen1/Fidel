import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function App() {
  const [step, setStep] = useState(0);

  return (
    <View style={styles.view}>

      <Text
        style= {styles.text}>
        ቁጽሪ:{step}
      </Text>
      <Pressable
       style = {styles.button}
       onPress = {() => setStep(step + 1)}
>

        <Text
        style ={styles.buttontext}>
          +1
        </Text>
      </Pressable>


      <Pressable
      style = {[styles.button,{backgroundColor:"red" }]}
      onPress = {() => setStep(0)}>
        <Text
        style ={styles.buttontext}
        >
          ሓድሽ
        </Text>
      </Pressable>

     
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    marginTop: 100,
    alignItems: "center",
  },

  text:{
    color:"default",
    fontSize:25,
    fontWeight:"bold",

    


  },
  button:{
   backgroundColor:"blue",
   marginBottom:10,
   width:"40%",
   height:45,

   borderRadius:20,
   justifyContent:"center",
   alignItems:"center",

  },

  buttontext:{

  color:"white",
  fontWeight:"bold",



  },





});