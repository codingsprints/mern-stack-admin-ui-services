import {
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";

import { useAuthStore } from "../../store";
import type { Category, ProductsFilterProps, Tenant } from "../../utils/types";
import { FetchCategories } from "../../services/category.service";
import { FetchTenants } from "../../services/tenants.service";
import { ROLES } from "../../constant/constant";

const ProductsFilter = ({
  children,
  setIsPublish,
  isPublish,
}: ProductsFilterProps) => {
  const { user } = useAuthStore();

  const { data: categoriesData } = FetchCategories();
  const { data: tenantData } = FetchTenants();

  return (
    <Card>
      <Row justify="space-between">
        <Col span={16}>
          <Row gutter={20}>
            <Col span={6}>
              <Form.Item name="q">
                <Input.Search allowClear={true} placeholder="Search" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item name="categoryId">
                <Select
                  style={{ width: "100%" }}
                  allowClear={true}
                  placeholder="Select category"
                >
                  {categoriesData?.data?.categoryDto?.map(
                    (category: Category) => {
                      return (
                        <Select.Option key={category._id} value={category._id}>
                          {category.name}
                        </Select.Option>
                      );
                    }
                  )}
                </Select>
              </Form.Item>
            </Col>
            {user!.role === ROLES.ADMIN && (
              <Col span={6}>
                <Form.Item name="tenantId">
                  <Select
                    style={{ width: "100%" }}
                    allowClear={true}
                    placeholder="Select restaurant"
                  >
                    {tenantData?.data?.tenantGetAllDto?.map(
                      (restaurant: Tenant) => {
                        return (
                          <Select.Option
                            key={restaurant.id}
                            value={restaurant.id}
                          >
                            {restaurant.name}
                          </Select.Option>
                        );
                      }
                    )}
                  </Select>
                </Form.Item>
              </Col>
            )}

            <Col span={6}>
              <Space>
                <Form.Item name="isPublish">
                  <Switch
                    defaultChecked={false}
                    onChange={() => {
                      setIsPublish(!isPublish);
                    }}
                  />
                </Form.Item>
                <Typography.Text style={{ marginBottom: 22, display: "block" }}>
                  Show only published
                </Typography.Text>
              </Space>
            </Col>
          </Row>
        </Col>
        <Col span={8} style={{ display: "flex", justifyContent: "end" }}>
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default ProductsFilter;
