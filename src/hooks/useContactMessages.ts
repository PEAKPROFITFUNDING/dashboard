import axiosInstance from "../api/axiosInstance";

export interface ContactData {
  _id: string;
  email: string;
  name: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: string;
}

export interface PaginationData {
  currentPage: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface FetchContactsResult {
  data: ContactData[];
  pagination: PaginationData;
}

const useContactMessages = () => {
  const fetchContacts = async (
    page: number = 1,
    search: string = ""
  ): Promise<FetchContactsResult> => {
    const searchParam = search.trim()
      ? `&search=${encodeURIComponent(search.trim())}`
      : "";
    const response = await axiosInstance.get(
      `/admin/contacts?pageNo=${page}${searchParam}`
    );
    return {
      data: response.data.result.data,
      pagination: response.data.result.pagination,
    };
  };

  return { fetchContacts };
};

export default useContactMessages;
