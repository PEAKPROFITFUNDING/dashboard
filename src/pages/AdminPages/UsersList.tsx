import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import UsersListTable from "./components/UsersListTable";

export default function UsersList() {
  return (
    <>
      <PageMeta
        title="Users List"
        description="Peak Profit Admin Users List Page"
      />
      <PageBreadcrumb pageTitle="Users List" />
      <UsersListTable />
    </>
  );
}
