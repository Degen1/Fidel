import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function InputScreen() {
  const [step, setStep] = useState(0);
  const changeStep = (delta: number) => {
    setStep((current) => current + delta);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.valueText}>ቁጽሪ: {step}</Text>

      <View style={styles.columns}>
        <View style={styles.column}>
          <Pressable style={[styles.button, styles.negativeButton]} onPress={() => changeStep(-1)}>
            <Text style={styles.buttonText}>-1</Text>
          </Pressable>

         
        </View>

        <View style={styles.column}>
          <Pressable style={styles.button} onPress={() => changeStep(1)}>
            <Text style={styles.buttonText}>+1</Text>
          </Pressable>

          
        </View>
      </View>

      <Pressable style={[styles.button, styles.resetButton]} onPress={() => setStep(0)}>
        <Text style={styles.buttonText}>ሓድሽ</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  valueText: {
    color: "black",
    fontSize: 25,
    fontWeight: "bold",
    marginBottom: 20,
  },

  columns: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 360,
    marginBottom: 12,
  },

  column: {
    width: "48%",
  },

  button: {
    backgroundColor: "blue",
    marginBottom: 10,
    width: "100%",
    height: 45,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  negativeButton: {
    backgroundColor: "grey",
  },

  resetButton: {
    backgroundColor: "red",
    marginTop: 4,
    maxWidth: 360,
    
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
