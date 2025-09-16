import { Card, Col, Form, InputNumber, Row, Space, Typography } from "antd";
import { FetchSingleCategory } from "../../../services/category.service";

type PricingProps = {
  selectedCategory: string;
};

const Pricing = ({ selectedCategory }: PricingProps) => {
  // const { data: fetchedCategory } = useQuery<Category>({
  //     queryKey: ['category', selectedCategory],
  //     queryFn: () => {
  //         return getCategory(selectedCategory).then((res) => res.data);
  //     },
  //     staleTime: 1000 * 60 * 5, // 5 minutes
  // });

  const { data: fetchedCategory } = FetchSingleCategory(selectedCategory);

  console.log(fetchedCategory);

  if (!fetchedCategory?.data?.categoryDto?.priceConfiguration) return null;

  return (
    <Card
      title={<Typography.Text>Product price</Typography.Text>}
      variant="borderless"
    >
      {Object.entries(
        fetchedCategory?.data?.categoryDto?.priceConfiguration
      ).map(([configurationKey, configurationValue]: any) => {
        return (
          <div key={configurationKey}>
            <Space direction="vertical" size="large" style={{ width: "100%" }}>
              <Typography.Text>
                {`${configurationKey} (${configurationValue.priceType})`}
              </Typography.Text>

              <Row gutter={20}>
                {configurationValue.availableOptions.map((option: string) => {
                  return (
                    <Col span={8} key={option}>
                      <Form.Item
                        label={option}
                        name={[
                          "priceConfiguration",
                          JSON.stringify({
                            configurationKey: configurationKey,
                            priceType: configurationValue.priceType,
                          }),
                          option,
                        ]}
                      >
                        <InputNumber addonAfter="₹" />
                      </Form.Item>
                    </Col>
                  );
                })}
              </Row>
            </Space>
          </div>
        );
      })}
    </Card>
  );
};

export default Pricing;
