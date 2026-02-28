import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function App() {
  const [click, setClick] = useState(0);

  return (
    <View style={styles.view}>
      <Text style={styles.score}>ቁጽሪ: {click}</Text>

      <View style={styles.buttonsContainer}>
        {/* LEFT COLUMN */}
        <View style={styles.column}>
          <Pressable style={styles.button} onPress={() => setClick(click + 1)}>
            <Text style={styles.buttontext}>+1</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={() => setClick(click + 5)}>
            <Text style={styles.buttontext}>+5</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={() => setClick(click + 10)}>
            <Text style={styles.buttontext}>+10</Text>
          </Pressable>
        </View>

        {/* RIGHT COLUMN */}
        <View style={styles.column}>
          <Pressable style={styles.button} onPress={() => setClick(click - 1)}>
            <Text style={styles.buttontext}>-1</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={() => setClick(click - 5)}>
            <Text style={styles.buttontext}>-5</Text>
          </Pressable>

          <Pressable style={styles.button} onPress={() => setClick(click - 10)}>
            <Text style={styles.buttontext}>-10</Text>
          </Pressable>
        </View>
      </View>

      {/* RESET BUTTON */}
      <Pressable style={styles.resetButton} onPress={() => setClick(0)}>
        <Text style={styles.buttontext}>ሓድሽ</Text>
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

  score: {
    fontSize: 50,
    fontWeight: "bold",
    marginBottom: 30,
  },

  buttonsContainer: {
    flexDirection: "row",
  },

  column: {
    // space between columns:
    marginHorizontal: 10,
  },

  button: {
    backgroundColor: "blue",
    height: 40,
    width: 100,
    borderRadius: 20,
    borderWidth: 4,
    borderColor: "green",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10, // replaces column gap
  },

  resetButton: {
    backgroundColor: "red",
    height: 45,
    width: 220,
    borderRadius: 20,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  buttontext: {
    color: "white",
    fontSize: 20,
  },
});