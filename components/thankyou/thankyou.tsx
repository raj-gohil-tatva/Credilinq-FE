import { Grid, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast, ToastOptions } from "react-toastify";
import { toastConfig } from "../../utilities/constant";

const Thankyou = () => {
  const router = useRouter();

  useEffect(() => {
    const { query } = router;
    if (query.ID) {
      toast.success(
        "Your form has been submitted successfully!",
        toastConfig as ToastOptions
      );
    }
  }, [router]);

  return (
    <Grid
      container
      className="thank-you-wrapper"
      alignContent={"flex-start"}
      alignItems="center"
    >
      <Grid item xs={12}>
        <Typography variant="h3" className="thank-you-text">
          Thank you for your trust in us.
        </Typography>
      </Grid>
      <Grid item flexGrow={1} xs={12}>
        <Typography variant="h6" className="thank-you-text-analysis">
          Our team will do the analysis for you and a report will be sent to
          your email address within 72 hours.
        </Typography>
      </Grid>
      <Grid item flexGrow={1} xs={12}>
        <Typography className="thank-you-text-information">
          in case we need some information, our team will contact you.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default Thankyou;
