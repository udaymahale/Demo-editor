import React from "react";
import { createRoot } from "react-dom";
import DemoEditor from "./DemoEditor";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);
root.render(<DemoEditor />);
