// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import DataTable from "examples/Tables/DataTable";

// import Link
import { Link } from "react-router-dom";

// @mui icons
import Icon from "@mui/material/Icon";

// Data
import partnersTableData from "layouts/partners/data/partnersTableData";
import MDButton from "components/MDButton";

function Partners() {
  const { columns, rows } = partnersTableData();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
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
                  Partners
                </MDTypography>
              </MDBox>

              <Grid container spacing={2}>
                <Link to={"/partners/add"}>
                  <MDBox ml={3} py={2} px={2} mt={3}>
                    <MDButton variant="gradient" color="info" size="small">
                      <Icon fontSize="big" color="light">
                        add
                      </Icon>
                      add partner
                    </MDButton>
                  </MDBox>
                </Link>
              </Grid>

              <Grid container spacing={2}>
                <Grid xs={9.5} md={11}>
                  <MDBox ml={3} py={2} px={2}>
                    <MDInput
                      variant="outlined"
                      label="Search here..."
                      fullWidth
                    />
                  </MDBox>
                </Grid>
                <Grid xs={1} md={1}>
                  <MDBox py={2}>
                    <MDButton variant="gradient" color="info">
                      <Icon fontSize="big" color="light">
                        refresh
                      </Icon>
                    </MDButton>
                  </MDBox>
                </Grid>
              </Grid>

              <MDBox pt={3}>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default Partners;