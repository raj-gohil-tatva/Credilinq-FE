import {
  Grid,
  Stepper,
  Box,
  Step,
  StepLabel,
  StepContent,
  Typography,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import { useState, useEffect } from "react";
import tick from "../../public/tick.svg";
import InputField from "../form/inputField";
import Image from "next/image";
import PhoneNumber from "../form/phoneNumber";
import {
  APIRoutes,
  baseAPIPath,
  countryDataWithCode,
  toastConfig,
} from "../../utilities/constant";
import FileUpload from "../form/fileUpload";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios, { AxiosRequestConfig } from "axios";
import { toast, ToastOptions } from "react-toastify";
import { useRouter } from "next/router";
import Classnames from "classNames";

const RegisterForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [countryCode, setCountryCode] = useState(countryDataWithCode[0].code);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const validationSchema: any = {
    CompanyUEN: Yup.string()
      .matches(
        /^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]{9}$/,
        "Invalid Company UEN"
      )
      .length(9, "Invalid Company UEN")
      .required("Company UEN is required"),
    CompanyName: Yup.string()
      .min(2, "Minimum 2 characters required")
      .max(90, "Characters should not exceed 90 characters")
      .required("Company name is required"),
    FullName: Yup.string()
      .min(2, "Minimum 2 characters required")
      .max(90, "Characters should not exceed 90 characters")
      .required("Full name is required"),
    CompanyPosition: Yup.string()
      .min(2, "Minimum 2 characters required")
      .max(90, "Characters should not exceed 90 characters")
      .required("Position is required"),
    Email: Yup.string()
      .email("Enter a valid email")
      .required("Email is required"),
    ReEmail: Yup.string()
      .email()
      .required("Email does not match")
      .oneOf([Yup.ref("Email")], "Email does not match"),
    PhoneNumber: Yup.string()
      .min(9, "Enter at least 9 digits")
      .max(11, "number should not exceed 11 digits")
      .matches(/^[0-9]+$/, "Please enter a valid phone number")
      .required("Enter a mobile number"),
    FileUploadLength: Yup.array().min(1, "Upload the required documents"),
    TermsAndConditions: Yup.boolean().oneOf(
      [true],
      "You must accept the terms and conditions"
    ),
  };

  const {
    values,
    touched,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
  } = useFormik({
    validateOnBlur: true,
    validateOnChange: true,
    initialValues: {
      CompanyUEN: "",
      CompanyName: "",
      FullName: "",
      CompanyPosition: "",
      Email: "",
      ReEmail: "",
      PhoneNumber: "",
      TermsAndConditions: false,
      FileUploadLength: [],
    },
    validationSchema: Yup.object({
      CompanyUEN: validationSchema.CompanyUEN,
      CompanyName: validationSchema.CompanyName,
      FullName: validationSchema.FullName,
      CompanyPosition: validationSchema.CompanyPosition,
      Email: validationSchema.Email,
      ReEmail: validationSchema.ReEmail,
      PhoneNumber: validationSchema.PhoneNumber,
      FileUploadLength: validationSchema.FileUploadLength,
      TermsAndConditions: validationSchema.TermsAndConditions,
    }),
    onSubmit: async (value, action) => {
      const { TermsAndConditions, ReEmail, FileUploadLength, ...rest } = value;
      Object.assign(rest, {
        PhoneNumber: `${countryCode}${rest.PhoneNumber}`,
      });
      const data: {
        [key: string]: string;
      } = { ...rest };
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (typeof data[key] !== "string") {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });
      for (const document of selectedFiles) {
        formData.append("Documents", document);
      }
      const requestConfig: AxiosRequestConfig = {
        method: "POST",
        baseURL: baseAPIPath,
        url: APIRoutes.register,
        data: formData,
      };
      action.resetForm();
      setSelectedFiles([]);
      try {
        const response = await axios(requestConfig);
        setIsLoading(false);
        router.push({ pathname: "/thankyou", query: { ID: response.data.ID } });
      } catch (error: any) {
        setIsLoading(false);
        const message = error?.message || "unknown reason";
        console.error("Unable to register the data due to", error);
        toast.error(
          `Failed to register the data due to: ${message}`,
          toastConfig as ToastOptions
        );
      }
    },
  });

  const isDisabled = (step: number) => {
    return activeStep + 1 >= step ? false : true;
  };

  useEffect(() => {
    setFieldValue("FileUploadLength", selectedFiles);
  }, [selectedFiles, setFieldValue]);

  useEffect(() => {
    const validateValue = async (path: string, value: string | number) => {
      const schema = Yup.object({
        [path]: validationSchema[path],
      });
      try {
        await schema.validate({ [path]: value });
        return true;
      } catch (error) {
        return false;
      }
    };

    const {
      CompanyName,
      CompanyUEN,
      CompanyPosition,
      Email,
      ReEmail,
      FileUploadLength,
      FullName,
      PhoneNumber,
      TermsAndConditions,
    } = values;
    const validateFields = async () => {
      const CompanyUENResult = await validateValue("CompanyUEN", CompanyUEN);
      const CompanyNameResult = await validateValue("CompanyName", CompanyName);
      const CompanyPositionResult = await validateValue(
        "CompanyPosition",
        CompanyPosition
      );
      const EmailResult = await validateValue("Email", Email);
      const ReEmailResult = Email === ReEmail;
      const FileUploadLengthResult = FileUploadLength.length !== 0;
      const FullNameResult = await validateValue("FullName", FullName);
      const PhoneNumberResult = await validateValue("PhoneNumber", PhoneNumber);
      let activeState = 0;
      if (CompanyUENResult && CompanyNameResult) {
        activeState++;
        if (
          FullNameResult &&
          CompanyPositionResult &&
          EmailResult &&
          ReEmailResult &&
          PhoneNumberResult
        ) {
          activeState++;
          if (FileUploadLengthResult) {
            activeState++;
            if (TermsAndConditions) {
              activeState++;
            }
          }
        }
      }
      setActiveStep(activeState);
    };

    validateFields();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  return (
    <form encType="multipart/form-data">
      <Grid container className="parent-center-grid">
        <Stepper
          activeStep={activeStep}
          className="grid-wrapper"
          orientation="vertical"
        >
          {/* Company Information */}
          <Step active className="company-information">
            <StepLabel
              className={Classnames("step-title-wrapper", {
                "step-title-wrapper-success": activeStep >= 1,
                "step-title-wrapper-disabled": isDisabled(1),
              })}
            >
              <Box display="flex">
                <Typography flexGrow={1} className="step-label-chip">
                  Company Information
                </Typography>
              </Box>
            </StepLabel>

            {/* Company Information Content*/}
            <StepContent className="step-content-wrapper">
              <Grid
                container
                columnSpacing={7}
                className="stepper-content-wrapper"
              >
                <Grid item xs={6}>
                  <InputField
                    label="Company UEN"
                    fullWidth
                    className="text-field-setter-first"
                    placeholder="Enter your company UEN"
                    name="CompanyUEN"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.CompanyUEN}
                    error={Boolean(touched.CompanyUEN && errors.CompanyUEN)}
                    helperText={touched.CompanyUEN && errors.CompanyUEN}
                    disabled={isDisabled(1)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputField
                    label="Company Name"
                    fullWidth
                    className="text-field-setter"
                    placeholder="Enter your company Name"
                    name="CompanyName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.CompanyName}
                    error={Boolean(touched.CompanyName && errors.CompanyName)}
                    helperText={touched.CompanyName && errors.CompanyName}
                    disabled={isDisabled(1)}
                  />
                </Grid>
              </Grid>
            </StepContent>
          </Step>

          {/* Applicant Information */}
          <Step active>
            <StepLabel
              className={Classnames("step-title-wrapper", {
                "step-title-wrapper-success": activeStep >= 2,
                "step-title-wrapper-disabled": isDisabled(2),
              })}
            >
              <Box display="flex">
                <Typography flexGrow={1} className="step-label-chip">
                  Applicant Information
                </Typography>
              </Box>
            </StepLabel>

            {/* Applicant Information Content*/}
            <StepContent className="step-content-wrapper">
              <Grid
                container
                columnSpacing={7}
                className="stepper-content-wrapper"
              >
                <Grid item xs={6}>
                  <InputField
                    label="Full Name"
                    fullWidth
                    className="text-field-setter-first"
                    name="FullName"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.FullName}
                    error={Boolean(touched.FullName && errors.FullName)}
                    helperText={touched.FullName && errors.FullName}
                    disabled={isDisabled(2)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputField
                    label="Position within company"
                    fullWidth
                    className="text-field-setter"
                    name="CompanyPosition"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.CompanyPosition}
                    error={Boolean(
                      touched.CompanyPosition && errors.CompanyPosition
                    )}
                    helperText={
                      touched.CompanyPosition && errors.CompanyPosition
                    }
                    disabled={isDisabled(2)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <InputField
                    label="Email Address"
                    type="email"
                    fullWidth
                    className="text-field-setter-sm-first"
                    name="Email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.Email}
                    error={Boolean(touched.Email && errors.Email)}
                    helperText={touched.Email && errors.Email}
                    disabled={isDisabled(2)}
                  />
                  <Typography variant="h6" className="email-report-notice">
                    The report will be delivered on this email address
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <InputField
                    label="Re-enter Email Address"
                    type="email"
                    fullWidth
                    className="text-field-setter-sm"
                    name="ReEmail"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.ReEmail}
                    error={Boolean(touched.ReEmail && errors.ReEmail)}
                    helperText={touched.ReEmail && errors.ReEmail}
                    disabled={isDisabled(2)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <PhoneNumber
                    codeValue={countryCode}
                    codeOnChange={setCountryCode}
                    name="PhoneNumber"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.PhoneNumber}
                    error={Boolean(touched.PhoneNumber && errors.PhoneNumber)}
                    helperText={touched.PhoneNumber && errors.PhoneNumber}
                    disabled={isDisabled(2)}
                  />
                </Grid>
              </Grid>
            </StepContent>
          </Step>

          {/* Upload Documents */}
          <Step active>
            <StepLabel
              className={Classnames("step-title-wrapper", {
                "step-title-wrapper-success": activeStep >= 3,
                "step-title-wrapper-disabled": isDisabled(3),
              })}
            >
              <Box display="flex">
                <Typography flexGrow={1} className="step-label-chip">
                  Upload Documents
                </Typography>
              </Box>
            </StepLabel>

            {/* Upload Documents Content*/}
            <StepContent className="step-content-wrapper">
              <Grid
                container
                columnSpacing={7}
                className="stepper-content-wrapper"
              >
                <Grid item xs={6}>
                  <FileUpload
                    disabled={isDisabled(3)}
                    selectedFiles={selectedFiles}
                    setSelectedFiles={setSelectedFiles}
                    fileUploadError={
                      touched.FileUploadLength && errors.FileUploadLength
                    }
                  />
                </Grid>
                <Grid item xs={6}>
                  <ul className="file-upload-list-description">
                    <li>
                      <Box display={"flex"}>
                        <Image src={tick} alt="Tick" /> PDFs (not scanned
                        copies) of company&apos;s operating bank current
                        account(s) statements for the past 6 months. Example: If
                        today is 24 May 23, then please upload bank statements
                        from Nov 22 to Apr 23 (both months inclusive)
                      </Box>
                    </li>
                    <li>
                      <Box display={"flex"}>
                        <Image src={tick} alt="Tick" /> If your company is
                        multi-banked, then please upload 6 months bank
                        statements for each bank account
                      </Box>
                    </li>
                    <li>
                      <Box display={"flex"}>
                        <Image src={tick} alt="Tick" />
                        If your file is password protected, we request you to
                        remove the password and upload the file to avoid
                        submission failure
                      </Box>
                    </li>
                    <li>
                      <Box display={"flex"}>
                        <Image src={tick} alt="Tick" />
                        <Typography>
                          In case if you are facing any issue while uploading
                          bank statements, Please contact us on{" "}
                          <a href="mailto:support@credilinq.ai">
                            support@credilinq.ai
                          </a>
                        </Typography>
                      </Box>
                    </li>
                  </ul>
                </Grid>
              </Grid>
            </StepContent>
          </Step>

          {/* Terms & Conditions*/}
          <Step active>
            <StepLabel
              className={Classnames("step-title-wrapper", {
                "step-title-wrapper-success": activeStep >= 4,
                "step-title-wrapper-disabled": isDisabled(4),
              })}
            >
              <Box display="flex">
                <Typography flexGrow={1} className="step-label-chip">
                  Terms & Conditions
                </Typography>
              </Box>
            </StepLabel>

            {/* Terms & ConditionsContent*/}
            <StepContent className="step-content-wrapper">
              <Grid
                container
                columnSpacing={7}
                className="stepper-content-wrapper terms-and-conditions-wrapper"
              >
                <Grid item xs={12}>
                  <FormControlLabel
                    disabled={isDisabled(4)}
                    control={
                      <Checkbox
                        name="TermsAndConditions"
                        onChange={(e) => {
                          setFieldValue("TermsAndConditions", e.target.checked);
                          setFieldTouched("TermsAndConditions", true);
                        }}
                        checked={values.TermsAndConditions}
                        className="terms-and-conditions-check-box"
                      />
                    }
                    label="By ticking, you are confirming that you have understood and are agreeing to the details mentioned:"
                  />

                  {touched.TermsAndConditions && !values.TermsAndConditions ? (
                    <Typography className="terms-and-conditions-error">
                      {"You must accept the terms and conditions"}
                    </Typography>
                  ) : null}

                  <ul className="file-upload-list-description terms-and-conditions">
                    <li>
                      <Box display={"flex"}>
                        <Image src={tick} alt="Tick" /> I confirm that I am the
                        authorized person to upload bank statements on behalf of
                        my company
                      </Box>
                    </li>
                    <li>
                      <Box display={"flex"}>
                        <Image src={tick} alt="Tick" />I assure you that
                        uploaded bank statements and provided company
                        information match and are of the same company, if there
                        is a mismatch then my report will not be generated
                      </Box>
                    </li>
                    <li>
                      <Box display={"flex"}>
                        <Image src={tick} alt="Tick" />I understand that this is
                        a general report based on the bank statements and
                        Credilinq is not providing a solution or guiding me for
                        my business growth
                      </Box>
                    </li>
                    <li>
                      <Box display={"flex"}>
                        <Image src={tick} alt="Tick" />
                        <Typography>
                          I have read and understand the{" "}
                          <a href="https://stage-smehealth.credilinq.ai/terms-and-conditions">
                            Terms & Conditions
                          </a>
                        </Typography>
                      </Box>
                    </li>
                  </ul>
                </Grid>
              </Grid>
            </StepContent>
          </Step>
        </Stepper>

        {/* Submit Button */}
        <Box display={"flex"} flexDirection={"row-reverse"} width={"100%"}>
          <Button
            className="submit-form-button"
            variant="contained"
            onClick={() => {
              setIsLoading(true);
              handleSubmit();
            }}
            disabled={isLoading}
          >
            Submit
          </Button>
        </Box>
      </Grid>
    </form>
  );
};

export default RegisterForm;
