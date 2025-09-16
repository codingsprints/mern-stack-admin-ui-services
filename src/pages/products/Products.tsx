import {
  LoadingOutlined,
  PlusOutlined,
  RightOutlined,
} from "@ant-design/icons";
import {
  Breadcrumb,
  Button,
  Drawer,
  Flex,
  Form,
  Space,
  Spin,
  Table,
  theme,
  Typography,
} from "antd";
import { Link } from "react-router-dom";
import {
  CreateProducts,
  FetchProductsWithPagination,
  UpdateProduct,
} from "../../services/product.service";
import { toast } from "react-toastify";
import ProductsFilter from "./ProductsFilter";
import { ProductTablecolumns } from "../../utils/constants/ProductTableColumn";
import type { FieldData, Product, productQueryParams } from "../../utils/types";
import { useEffect, useMemo, useState } from "react";
import { CURRENT_PAGE, PER_PAGE } from "../../constant/constant";
import { useAuthStore } from "../../store";
import { debounce } from "lodash";
import ProductForm from "./forms/ProductForm";
import { makeFormData } from "./helpers";

const Products = () => {
  const { user } = useAuthStore();
  const [filterForm] = Form.useForm();
  const [form] = Form.useForm();
  const {
    token: { colorBgLayout },
  } = theme.useToken();

  const [selectedProduct, setCurrentProduct] = useState<Product | null>(null);

  const [queryParams, setQueryParams] = useState<productQueryParams>({
    perPage: 10,
    currentPage: CURRENT_PAGE,
    q: "",
    tenantId: user!.role === "manager" ? user?.tenant?.id : undefined,
    categoryId: "",
  });
  const [productIsPubliced, setProductIsPubliced] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const debouncedQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }));
    }, 500);
  }, []);
  const [currentUserID, setCurrentUserID] = useState<string>("");

  useEffect(() => {
    if (selectedProduct) {
      setDrawerOpen(true);

      console.log("seletedProduct", selectedProduct.priceConfiguration);

      const priceConfiguration = Object.entries(
        selectedProduct.priceConfiguration
      ).reduce((acc, [key, value]) => {
        const stringifiedKey = JSON.stringify({
          configurationKey: key,
          priceType: value.priceType,
        });

        return {
          ...acc,
          [stringifiedKey]: value.availableOptions,
        };
      }, {});

      const attributes = selectedProduct.attributes.reduce((acc, item) => {
        return {
          ...acc,
          [item.name]: item.value,
        };
      }, {});

      form.setFieldsValue({
        ...selectedProduct,
        priceConfiguration,
        attributes,
        // todo: fix this
        categoryId: selectedProduct.category._id,
      });
    }
  }, [selectedProduct, form]);

  const createProductSuccess = () => {
    form.setFieldValue("image", null);
    form.resetFields();
    setCurrentProduct(null);
    toast.success("Product created successfully");
    setCurrentUserID("");
    setDrawerOpen(false);
  };

  const createProductFailure = (message: string) => {
    toast.error(message);
  };

  const { mutate: createProductsMutate, isPending: isCreateLoading } =
    CreateProducts(createProductSuccess, createProductFailure);

  const callbackUpdateSuccess = () => {
    form.setFieldValue("image", null);
    form.resetFields();
    setCurrentProduct(null);
    toast.success("Product update successfully");
    setCurrentUserID("");
    setDrawerOpen(false);
  };

  const callbackUpdateFailure = (message: string) => {
    toast.error(message);
  };

  const { mutate: updateProduct } = UpdateProduct(
    currentUserID,
    callbackUpdateSuccess,
    callbackUpdateFailure
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

  const onHandleSubmit = async () => {
    /*

    const currentData = {
        '{"configurationKey":"Size","priceType":"base"}': {
            Small: 100,
            Medium: 200,
            Large: 400,
        },
        '{"configurationKey":"Crust","priceType":"aditional"}': {
            Thin: 0,
            Thick: 50,
        },
    };

    convert to blow given format.

    const dummy = {
        Size: { priceType: 'base', availableOptions: { Small: 400, Medium: 600, Large: 800 } },
        Crust: { priceType: 'aditional', availableOptions: { Thin: 50, Thick: 100 } },
    };

    
    */

    await form.validateFields();
    const isEdit = !!selectedProduct;
    console.log("form.getFieldsValue()", form.getFieldsValue());

    const priceConfiguration = form.getFieldValue("priceConfiguration");
    const pricing = Object.entries(priceConfiguration).reduce(
      (acc, [key, value]) => {
        const parsedKey = JSON.parse(key);
        return {
          ...acc,
          [parsedKey.configurationKey]: {
            priceType: parsedKey.priceType,
            availableOptions: value,
          },
        };
      },
      {}
    );

    const categoryId = form.getFieldValue("categoryId");
    /*
    const attrs = [
        { name: 'Is Hit', value: true },
        { name: 'Spiciness', value: 'Hot' },
    ];

    convert to below given format.

    const currentAttrs = {
        isHit: 'No',
        Spiciness: 'Less',
    };
    */

    const attributes = Object.entries(form.getFieldValue("attributes")).map(
      ([key, value]) => {
        return {
          name: key,
          value: value,
        };
      }
    );

    const postData = {
      ...form.getFieldsValue(),
      tenantId:
        user!.role === "manager"
          ? user?.tenant?.id
          : form.getFieldValue("tenantId"),
      isPublish: form.getFieldValue("isPublish") ? true : false,
      image: form.getFieldValue("image"),
      categoryId,
      priceConfiguration: pricing,
      attributes,
    };

    console.log("postData", postData);

    const formData = makeFormData(postData);
    console.log(formData);

    if (isEdit) {
      updateProduct(formData);
    } else {
      createProductsMutate(formData);
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
                setDrawerOpen(true);
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
                        setCurrentUserID(record?._id);
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
        <Drawer
          title={selectedProduct ? "Update Product" : "Add New Product"}
          width={720}
          styles={{ body: { backgroundColor: colorBgLayout } }}
          //   destroyOnClose={true}
          open={drawerOpen}
          onClose={() => {
            form.resetFields();
            setCurrentProduct(null);
            setDrawerOpen(false);
          }}
          extra={
            <Space>
              <Button
                onClick={() => {
                  form.resetFields();
                  setCurrentProduct(null);
                  setDrawerOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                onClick={onHandleSubmit}
                loading={isCreateLoading}
              >
                Submit
              </Button>
            </Space>
          }
        >
          <Form layout="vertical" form={form}>
            <ProductForm form={form} />
          </Form>
        </Drawer>
      </Space>
    </>
  );
};

export default Products;
