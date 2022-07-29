// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// @mui icons
import Icon from "@mui/material/Icon";

// Images
import company1 from "assets/images/huawei-logo.png";

export default function data() {
  const Company = ({ image, name }) => (
    <MDBox display="flex" alignItems="center" lineHeight={1}>
      <MDAvatar src={image} name={name} size="sm" />
      <MDBox ml={2} lineHeight={1}>
        <MDTypography display="block" variant="button" fontWeight="medium">
          {name}
        </MDTypography>
      </MDBox>
    </MDBox>
  );

  return {
    columns: [
      {
        Header: "Company Name",
        accessor: "author",
        width: "45%",
        align: "left",
      },
      { Header: "manager", accessor: "manager", align: "center" },
      { Header: "date", accessor: "date", align: "center" },
      { Header: "edit", accessor: "edit", align: "center" },
      { Header: "delete", accessor: "delete", align: "center" },
    ],

    rows: [
      {
        author: <Company image={company1} name="Huawei" />,
        manager: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            {2}
          </MDTypography>
        ),
        date: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            12 / 03 / 2022
          </MDTypography>
        ),
        edit: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            <Icon fontSize="small">edit</Icon>
          </MDTypography>
        ),
        delete: (
          <MDTypography
            component="a"
            href="#"
            variant="caption"
            color="text"
            fontWeight="medium"
          >
            <Icon fontSize="small" color="primary">
              delete
            </Icon>
          </MDTypography>
        ),
      },
    ],
  };
}