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
import CsvUploader from "examples/CsvUploader";

//import Hook
import { useState } from "react";

// @mui icons
import Icon from "@mui/material/Icon";

//import Add component

// Data
import VouchersTableData from "./data/VouchersTableData";
import MDButton from "components/MDButton";

import Papa from "papaparse";

function Vouchers() {
  const { columns, rows, confirmation, rawData } = VouchersTableData();

  const [openAddModel, setOpenAddModel] = useState(false);

  const [openCsvUploader, setOpenCsvUploader] = useState(false);

  const handleDownload = (title, type) => {
    let data = [];
    let columns = [];
    if (rawData.length > 0) {
      if (type === "export") {
        rawData.map((row) =>
          data.push({
            id: row.id,
            nom: row.nom,
            prenom: row.prenom,
            email: row.email,
            departement: row.departement,
            createdAt: row.createdAt,
          })
        );
        columns = ["id", "nom", "prenom", "email", "departement", "createdAt"];
      }
    }
    if (type === "template") {
      columns = ["societe", "provider", "code"];
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
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {!openCsvUploader && !openAddModel && (
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
                    Vouchers
                  </MDTypography>
                </MDBox>

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

      {confirmation}
    </DashboardLayout>
  );
}

export default Vouchers;
