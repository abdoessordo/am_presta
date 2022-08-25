// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import FormHelperText from "@mui/material/FormHelperText";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";

//import UseState Hook
import { useEffect, useState } from "react";

import DropFileInput from "components/DropFileInput/DropFileInput";

// Axios
import axiosAuth from "services/authAxios";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setUpdater } from "context";

import { addCollabsRoute, uploadRoute } from "utils/APIRoutes";
import { allCompaniesRoute } from "utils/APIRoutes";

function AddCollab({ closeAddModel }) {
  const [formErrors, setFormErrors] = useState({
    nom: "",
  });

  const [collaborator, setCollaborator] = useState({
    nom: "",
    prenom: "",
    mail: "",
  });

  const [allCompanies, setAllCompanies] = useState()
  const [allProviders, setAllProviders] = useState()

  const [file, setFile] = useState(null);

  const [controller, dispatch] = useMaterialUIController();

  const { updater } = controller;


  useEffect(() => {
    const getAllCompanies = async () => {
      const { data } = await axiosAuth.get(allCompaniesRoute);
      let temp = [];
      data.map((provider) => temp.push({ id: provider.id, nom: provider.nom }));
      setProviders(temp);
    };
    getAllCompanies();
  }, []);


  const handleSubmit = async (event) => {
    const { nom } = collaborator;
    event.preventDefault();
    setFormErrors(validate(collaborator));
    if (Object.keys(validate(collaborator)).length === 0) {
      const { data } = await axiosAuth.post(addCollabsRoute, {
        account: {
          nom: collaborator.nom,
          prenom: collaborator.prenom,
          email: collaborator.mail,
        },
      });

      const ID = data.id;
      if (data.status) {
        const fd = new FormData();
        fd.append("image", file);
        fd.append("id", ID);
        fd.append("model", "Collaborateur");
        console.log(fd.getAll("image"));
        const config = {
          method: "post",
          url: uploadRoute,
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: fd,
        };

        await axiosAuth(config);

        closeAddModel(false);
        setUpdater(dispatch, !updater);
      } else {
        alert(data.msg);
      }
    }
  };

  const handleChange = (event) => {
    const key = event.target.name;
    const value = event.target.value;
    setCollaborator((prev) => {
      return { ...prev, [key]: value };
    });
  };

  const validate = (values) => {
    const errors = {};
    if (!values.nom) {
      errors.coursename = "Collaborator Name is required !";
    }
    return errors;
  };

  return (
    <Card sx={{ mt: "50px" }}>
      <MDBox
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        variant="gradient"
        bgColor="info"
        borderRadius="lg"
        coloredShadow="info"
        p={3}
        mx={2}
        mt={-3}
        mb={1}
      >
        <MDTypography variant="h6" color="white">
          Add Voucher
        </MDTypography>

        <MDButton
          variant="gradient"
          color="dark"
          size="small"
          iconOnly
          onClick={() => closeAddModel(false)}
        >
          <Icon fontSize="small">close</Icon>
        </MDButton>
      </MDBox>

      <MDBox pt={4} pb={3} px={10}>
        <MDBox
          component="form"
          role="form"
          onSubmit={(event) => handleSubmit(event)}
        >
          <MDBox display="flex">
            <MDBox mb={2} ml={2} sx={{ width: "50%" }}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-label">Provider</InputLabel>
                <Select
                  error={formErrors.provider}
                  name="provider"
                  sx={{ height: 45 }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedProvider.name}
                  label="Age"
                  onChange={(e) => handleSelectedProvider(e)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                      },
                    },
                  }}
                  input={
                    <OutlinedInput id="select-multiple-chip" label="Provider" />
                  }
                >
                  {providers.map((provider) => (
                    <MenuItem key={provider.id} value={provider}>
                      {provider.nom}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error>{formErrors.provider}</FormHelperText>
              </FormControl>
            </MDBox>

            <MDBox mb={2} ml={2} sx={{ width: "50%" }}>
              <FormControl sx={{ width: "100%" }}>
                <InputLabel id="demo-simple-select-label">Provider</InputLabel>
                <Select
                  error={formErrors.provider}
                  name="provider"
                  sx={{ height: 45 }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedProvider.name}
                  label="Age"
                  // onChange={(e) => handleSelectedProvider(e)}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        maxHeight: 150,
                      },
                    },
                  }}
                  input={
                    <OutlinedInput id="select-multiple-chip" label="Provider" />
                  }
                >
                  {providers.map((provider) => (
                    <MenuItem key={provider.id} value={provider}>
                      {provider.nom}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error>{formErrors.provider}</FormHelperText>
              </FormControl>
            </MDBox>
          </MDBox>

          <MDBox mb={2}>
            <MDInput
              type="text"
              label="Code"
              variant="outlined"
              fullWidth
              name="prenom"
              onChange={(e) => handleChange(e)}
              error={formErrors.coursename}
            />
            <FormHelperText error>{formErrors.coursename}</FormHelperText>
          </MDBox>

          <MDBox mt={4} mb={2} display="flex" justifyContent="center">
            <MDButton
              type="submit"
              variant="gradient"
              color="info"
              sx={{ width: "30%", mr: "5px" }}
            >
              Submit
            </MDButton>

            <MDButton
              type="reset"
              variant="gradient"
              color="dark"
              sx={{ width: "30%", ml: "5px" }}
            >
              clear
            </MDButton>
          </MDBox>
        </MDBox>
      </MDBox>
    </Card>
  );
}

export default AddCollab;
