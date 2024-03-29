import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { routes } from "./AppRoutes";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { deepPurple } from "@mui/material/colors";

function App() {
  const router = createBrowserRouter(routes);
  const theme = createTheme({
    palette: {
      primary: deepPurple,
      secondary: {
        main: "#4caf50",
      },
    },
  });
  return (
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
