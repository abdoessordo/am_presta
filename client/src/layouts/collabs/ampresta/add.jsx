// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import FormHelperText from "@mui/material/FormHelperText";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
//import UseState Hook
import { useEffect, useState } from "react";
import DropFileInput from "components/DropFileInput/DropFileInput";

// Axios
import axiosAuth from "services/authAxios";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setUpdater } from "context";

import { addCollabsRoute, uploadRoute } from "utils/APIRoutes";

import {allCompaniesRoute} from "utils/APIRoutes";
import {addCollabRouteAdmin} from "utils/APIRoutes";
function AddCollab({ closeAddModel }) {
  const [formErrors, setFormErrors] = useState({
    nom: "",
  });

  const [collaborator, setCollaborator] = useState({
    nom: "",
	  prenom:"",
	  mail:""
  });
  const [selectedCompany, setSelectedCompany] = useState({
    nom: "",
    id: "",
  });

  const [companies, setCompanies] = useState([
    {
      id: "",
      nom: "",
    },
  ]);

  const [file, setFile] = useState(null);

  const [controller, dispatch] = useMaterialUIController();

  const { updater } = controller;
  const handleSelectedCompany = (event) => {
    const company = event.target.value;
    setCollaborator((prev) => ({ ...prev, company }));
    setSelectedCompany(company);
  };
	useEffect(()=>{
		
    const getAllSociete = async () => {
      const { data } = await axiosAuth.get(allCompaniesRoute);
      let temp = [];
      data.msg.map((company) =>
        temp.push({ id: company.id, nom: company.name })
      );
      setCompanies(temp);
    };
 getAllSociete();

	},[])

  const handleSubmit = async (event) => {
    const { nom } = collaborator;
    event.preventDefault();
    setFormErrors(validate(collaborator));
	      console.log({account:{
		      nom:collaborator.nom,
		      prenom:collaborator.prenom,
		      email: collaborator.mail,
		      societe:collaborator.company.id
	      }})
    if (Object.keys(validate(collaborator)).length === 0) {
      const { data } = await axiosAuth.post(addCollabRouteAdmin, {
	      account:{
		      nom:collaborator.nom,
		      prenom:collaborator.prenom,
		      email: collaborator.mail,
		      societe:collaborator.company.id
	      }
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
          Add Collaborator
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
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="First Name"
              variant="outlined"
              fullWidth
              name="prenom"
              onChange={(e) => handleChange(e)}
              error={formErrors.coursename}
            />
            <FormHelperText error>{formErrors.coursename}</FormHelperText>
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="Last Name"
              variant="outlined"
              fullWidth
              name="nom"
              onChange={(e) => handleChange(e)}
              error={formErrors.coursename}
            />
            <FormHelperText error>{formErrors.coursename}</FormHelperText>
          </MDBox>
          <MDBox mb={2}>
            <MDInput
              type="text"
              label="Email"
              variant="outlined"
              fullWidth
              name="mail"
              onChange={(e) => handleChange(e)}
              error={formErrors.coursename}
            />
            <FormHelperText error>{formErrors.coursename}</FormHelperText>
          </MDBox>

          <MDBox mb={2}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id="demo-simple-select-label">Company</InputLabel>
              <Select
                error={formErrors.company}
                name="company"
                sx={{ height: 45 }}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selectedCompany.name}
                label="Age"
                onChange={(e) => handleSelectedCompany(e)}
                MenuProps={{
                  PaperProps: {
                    style: {
                      maxHeight: 150,
                    },
                  },
                }}
                input={
                  <OutlinedInput id="select-multiple-chip" label="Company" />
                }
              >
                {companies.map((company) => (
                  <MenuItem key={company.id} value={company}>
                    {company.nom}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText error>{formErrors.company}</FormHelperText>
            </FormControl>
          </MDBox>
          <Card>
            <MDBox>
              <DropFileInput
                title="Drag & Drop collab photo here"
                name="image"
                onFileChange={(files) => setFile(files[0])}
              />
            </MDBox>
          </Card>

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
