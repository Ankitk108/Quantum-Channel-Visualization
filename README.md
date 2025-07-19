# Quantum Channel Visualization 🌀

This is an interactive web-based visualization tool for understanding how different types of quantum noise channels affect a qubit's Bloch sphere representation.

> Built using HTML, CSS, JavaScript and Plotly.js for real-time 3D rendering.

---

## 🌐 Live Demo

🔗 [View on GitHub Pages](https://ankitk108.github.io/Quantum-Channel-Visualization)

---

## 🎯 Features

- Visualizes how quantum noise channels deform the Bloch sphere.
- Supports **Bit Flip**, **Phase Flip**, and **Depolarizing** channels.
- Slider to control the noise parameter `p`.
- Smooth animated transitions using Plotly.js.
- Intuitive UI for learning and teaching quantum information.

---

## 📸 Screenshot

![Quantum Channel Visualization](screenshot.png)

---

## 🧪 Quantum Channels Implemented

1. **Bit Flip Channel**  
   Simulates noise that flips the qubit state from |0⟩ to |1⟩ or vice versa with probability `p`.

2. **Phase Flip Channel**  
   Introduces a relative phase flip (Z gate-like error) with probability `p`.

3. **Depolarizing Channel**  
   Randomly applies X, Y, or Z with equal probability `p/3`, shrinking the Bloch sphere.

---

## 📁 Project Structure

```
Quantum-Channel-Visualization/
├── index.html        # UI layout and script hooks
├── main.js           # Visualization logic and noise simulation
└── style.css         # Styling for the layout
```

---

## 🚀 How to Use

1. Clone the repo:
   ```bash
   git clone https://github.com/Ankitk108/Quantum-Channel-Visualization.git
   ```

2. Open `index.html` in any modern web browser — no installation required!

---

## 📌 Dependencies

- [Plotly.js](https://plotly.com/javascript/) — for rendering the Bloch sphere in 3D.

---

## 🔮 Future Plans

Here are some ideas and features planned for future versions:

- ✅ Add more noise channels like:
  - Amplitude Damping
  - Generalized Kraus Maps
- ✅ Mobile-friendly responsive design
- ✅ Add "Preset States" menu (e.g., |0⟩, |+⟩, |1⟩)
- ✅ Ability to export the Bloch sphere as PNG image
- ✅ Side panel showing the density matrix in real-time
- ✅ Add plots for Fidelity or Purity as a function of noise
- ✅ Create a blog post/tutorial explaining the theory behind the visualization
- ✅ Add educational tooltips or explanations for sliders & controls

Contributions are welcome!

---

## 🧑‍💻 Author

**Ankit Kashyap**  
Student at IISER Mohali  
🔗 [GitHub](https://github.com/Ankitk108)

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.