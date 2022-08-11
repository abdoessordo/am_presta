// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

//import UseState
import { useState } from "react";

// @mui icons
import Icon from "@mui/material/Icon";

// Data
import companiesTableData from "layouts/companies/data/companiesTableData";
import MDButton from "components/MDButton";

//Add companies component
import AddCompanies from "./add";

import Papa from "papaparse";
import { useNavigate } from "react-router-dom";

function Companies() {
  const navigate = useNavigate()
  const { columns, rows, confirmation, rawData } = companiesTableData();
  const [openAddModel, setOpenAddModel] = useState(false);

  const handleDownload = (title, type) => {
    if (rawData.length > 0) {
      let data = [];
      let columns = [];
      if (type === "export") {
        rawData.map((row) =>
          data.push({
            id: row.id,
            company_name: row.name,
            admin_first_name: row.Collaborateurs[0].nom,
            admin_last_name: row.Collaborateurs[0].prenom,
            createdAt: row.createdAt,
          })
        );
        columns = [
          "id",
          "company_name",
          "admin_first_name",
          "admin_last_name",
          "createdAt",
        ];
      }
      if (type === "template") {
        columns = [
          "username",
          "first_name",
          "last_name",
          "company_name",
          "email",
          "password",
          "confirm_password",
        ];
        let blank = {};
        columns.map((header) => (blank.header = ""));
        data.push(blank);
      }

      const csv = Papa.unparse(data, {
        header: true,
        delimiter: ", ",
        columns: columns,
      });
      const blob = new Blob([csv]);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob, { type: "text/plain" });
      a.download = `${title}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {!openAddModel && (
        <MDBox pt={6} pb={1}>
          <Grid container spacing={6}>
            <Grid item xs={12}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="info"
                  borderRadius="lg"
                  coloredShadow="info"
                >
                  <MDTypography variant="h6" color="white">
                    Companies
                  </MDTypography>
                </MDBox>

                <Grid container spacing={2}>
                  <MDBox ml={3} py={1.9} px={2} mt={3}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      size="small"
                      onClick={setOpenAddModel}
                    >
                      <Icon fontSize="big" color="light">
                        add
                      </Icon>
                      add company
                    </MDButton>
                  </MDBox>
                  <MDBox ml={3} py={1.9} px={2} mt={3}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      size="small"
                      onClick={() => handleDownload("allCompanies", "export")}
                    >
                      Export
                    </MDButton>
                  </MDBox>

                  <MDBox ml={3} py={1.9} px={2} mt={3}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      size="small"
                      onClick={() =>
                        handleDownload("addCompanyTemplate", "template")
                      }
                    >
                      Download Template
                    </MDButton>
                  </MDBox>

                  <MDBox ml={3} py={1.9} px={2} mt={3}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      size="small"
                      onClick={() => {
                        localStorage.setItem("uploadType", "companies");
                        navigate("/csv");
                      }}
                    >
                      upload csv
                    </MDButton>
                  </MDBox>
                </Grid>

                <MDBox>
                  <DataTable
                    table={{ columns, rows }}
                    isSorted={false}
                    canSearch
                  />
                </MDBox>
              </Card>
            </Grid>
          </Grid>
        </MDBox>
      )}
      {openAddModel && <AddCompanies closeAddModel={setOpenAddModel} />}
      {confirmation}
    </DashboardLayout>
  );
}

export default Companies;
