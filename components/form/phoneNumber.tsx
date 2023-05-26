import {
  Select,
  Grid,
  MenuItem,
  InputLabel,
  FormControl,
  TextFieldProps,
} from "@mui/material";
import { countryDataWithCode } from "../../utilities/constant";
import InputField from "./inputField";

interface PhoneNumberProps {
  codeValue: string;
  codeOnChange: (e: string) => void;
}

const PhoneNumber = ({
  codeValue,
  codeOnChange,
  ...restProps
}: TextFieldProps & PhoneNumberProps) => {
  return (
    <Grid container className="phone-number-wrapper">
      <Grid item xs={5}>
        <FormControl fullWidth className="country-dropdown">
          <InputLabel>Code</InputLabel>
          <Select
            value={codeValue}
            label="Code"
            fullWidth
            disabled={restProps.disabled}
            variant="outlined"
            onChange={(e) => {
              codeOnChange(e.target.value);
            }}
          >
            {countryDataWithCode.map((country) => (
              <MenuItem key={country.code} value={country.code}>
                {`(${country.code}) ${country.name}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={7}>
        <InputField
          className="disable-spin-buttons"
          label="Mobile Number"
          fullWidth
          type="number"
          {...restProps}
        />
      </Grid>
    </Grid>
  );
};

export default PhoneNumber;
