import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Flex,
  Form,
  Space,
  Spin,
  Table,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import {
  CreateProducts,
  FetchProductsWithPagination,
} from "../../services/product.service";
import { toast } from "react-toastify";
import ProductsFilter from "./ProductsFilter";
import { ProductTablecolumns } from "../../utils/constants/ProductTableColumn";
import type { FieldData, Product, productQueryParams } from "../../utils/types";
import { useMemo, useState } from "react";
import { CURRENT_PAGE, PER_PAGE } from "../../constant/constant";
import { useAuthStore } from "../../store";
import { debounce } from "lodash";
import { FetchCategories } from "../../services/category.service";

const Products = () => {
  const { user } = useAuthStore();
  const [filterForm] = Form.useForm();
  const [form] = Form.useForm();

  const [selectedProduct, setCurrentProduct] = useState<Product | null>(null);
  const [queryParams, setQueryParams] = useState<productQueryParams>({
    perPage: 10,
    currentPage: CURRENT_PAGE,
    q: "",
    tenantId: user!.role === "manager" ? user?.tenant?.id : undefined,
    categoryId: "",
  });
  const [productIsPubliced, setProductIsPubliced] = useState(false);
  const debouncedQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
    }, 500);
  }, []);

  const createProductSuccess = () => {};

  const createProductFailure = (message: string) => {
    toast.error(message);
  };

  const { mutate: createProductsMutate } = CreateProducts(
    createProductSuccess,
    createProductFailure
  );

  const {
    data: productsData,
    isFetched: productIsFetch,
    isLoading: productIsLoading,
    isError: productIsError,
    error: productError,
  } = FetchProductsWithPagination(queryParams, productIsPubliced);

  console.log(productsData);
  console.log("queryParams", queryParams);
  console.log(productError);

  const onFilterChange = (changedFields: FieldData[]) => {
    console.log("changedFields", changedFields);
    const changedFilterFields = changedFields
      .map((item) => ({
        [item.name[0]]: item.value,
      }))
      .reduce((acc, item) => ({ ...acc, ...item }), {});
    if ("q" in changedFilterFields) {
      debouncedQUpdate(changedFilterFields.q);
    } else {
      setQueryParams((prev) => ({
        ...prev,
        ...changedFilterFields,
        currentPage: 1,
      }));
    }
  };

  return (
    <>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Flex justify="space-between">
          <Breadcrumb
            separator={<RightOutlined />}
            items={[
              { title: <Link to="/">Dashboard</Link> },
              { title: "Products" },
            ]}
          />

          {productIsLoading && (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          )}
          {productIsError && (
            <Typography.Text type="danger">
              {productError.message}
            </Typography.Text>
          )}
        </Flex>

        <Form form={filterForm} onFieldsChange={onFilterChange}>
          <ProductsFilter
            isPublish={productIsPubliced}
            setIsPublish={setProductIsPubliced}
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                // setDrawerOpen(true);
              }}
            >
              Add Product
            </Button>
          </ProductsFilter>
        </Form>

        <Table
          columns={[
            ...ProductTablecolumns,
            {
              title: "Actions",
              render: (_, record: Product) => {
                return (
                  <Space>
                    <Button
                      type="link"
                      onClick={() => {
                        setCurrentProduct(record);
                      }}
                    >
                      Edit
                    </Button>
                  </Space>
                );
              },
            },
          ]}
          dataSource={productsData?.data?.productDto}
          rowKey={"id"}
          pagination={{
            total: productsData?.data?.total,
            pageSize: queryParams.perPage,
            current: queryParams.currentPage,
            onChange: (page) => {
              console.log(page);
              setQueryParams((prev) => {
                return {
                  ...prev,
                  currentPage: page,
                };
              });
            },
            showTotal: (total: number, range: number[]) => {
              console.log(total, range);
              return `Showing ${range[0]}-${range[1]} of ${total} items`;
            },
          }}
        />
      </Space>
    </>
  );
};

export default Products;
