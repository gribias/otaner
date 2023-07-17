import { useEffect, useRef } from "react";
import { useLogin } from "@refinedev/core";

import { Box, Container, Typography } from "@mui/material";
import { ThemedTitle } from "@refinedev/mui";

import { CredentialResponse } from "../interfaces/google";
import { yariga } from "assets";

const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export const Login: React.FC = () => {
  const { mutate: login } = useLogin<CredentialResponse>();

  const GoogleButton = (): JSX.Element => {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (typeof window === "undefined" || !window.google || !divRef.current) {
        return;
      }

      try {
        window.google.accounts.id.initialize({
          ux_mode: "popup",
          client_id: GOOGLE_CLIENT_ID,
          callback: async (res: CredentialResponse) => {
            if (res.credential) {
              login(res);
            }
          },
        });
        window.google.accounts.id.renderButton(divRef.current, {
          theme: "filled_blue",
          size: "medium",
          type: "standard",
        });
      } catch (error) {
        console.log(error);
      }
    }, []);

    return <div ref={divRef} />;
  };

  return (
    <Container
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        display="flex"
        gap="25px"
        justifyContent="center"
        flexDirection="column"
      >
        <div>
          <img src={yariga} alt="logo"/>
        </div>

        <GoogleButton />

        <Typography align="center" color={"text.secondary"} fontSize="12px">
          Powered by Auth0
        </Typography>
      </Box>
    </Container>
  );
};
