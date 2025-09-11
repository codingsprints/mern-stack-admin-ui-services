import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Button, Flex, Form, Space, Spin, Typography } from "antd";
import { Link } from "react-router-dom";
import {
  CreateProducts,
  FetchProductsWithPagination,
} from "../../services/product.service";
import { toast } from "react-toastify";
import ProductsFilter from "./ProductsFilter";

const Products = () => {
  const createProductSuccess = () => {};

  const createProductFailure = (message: string) => {
    toast.error(message);
  };

  const { mutate: createProductsMutate } = CreateProducts(
    createProductSuccess,
    createProductFailure
  );

  const {
    isFetched: productIsFetch,
    isError: productIsError,
    error: productError,
  } = FetchProductsWithPagination();

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

          {productIsFetch && (
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

        <Form>
          <ProductsFilter>
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
      </Space>
    </>
  );
};

export default Products;
