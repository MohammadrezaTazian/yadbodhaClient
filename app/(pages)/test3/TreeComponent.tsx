import React, { useEffect, useState } from 'react';
import { Col, Form, Input, Modal, Row, Space, Tree, Menu, message, Dropdown } from 'antd';
import './TreeNode.css';
import FormItem from 'antd/es/form/FormItem';

type Node = {
  id: number;
  name: string;
  description: string;
  profile_image: string;
  parent_id: number | null;
  active: boolean; // اضافه کردن فیلد برای فعال/غیرفعال کردن نود
};

const TreeComponent: React.FC = () => {
  const [treeData, setTreeData] = useState<Node[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm<Node>();

  const fetchData = () => {
    const nodes: Node[] = [];
    for (let i = 1; i <= 18; i++) {
      nodes.push({
        id: i,
        name: `جعفر ضیائی `,
        description: `فاطمه حق باطنی `,
        profile_image: 'https://bizgo.ir/Portals/0/DNNGalleryPro/uploads/2024/1/6/home-slider.jpg',
        parent_id: i > 1 && i <= 16 ? Math.floor(i / 2) : null,
        active: true,
      });
    }
    const structuredData = buildTree(nodes);
    setTreeData(structuredData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const buildTree = (nodes: Node[]) => {
    const tree: any = [];
    const lookup: { [key: number]: Node & { children: any[] } } = {};

    nodes.forEach((node) => {
      lookup[node.id] = { ...node, children: [] };
    });

    nodes.forEach((node) => {
      if (node.parent_id === null) {
        tree.push(lookup[node.id]);
      } else {
        lookup[node.parent_id].children.push(lookup[node.id]);
      }
    });

    return tree;
  };

  const renderTree = (data: any[]): any[] => {
    return data.map((node) => ({
      title: (
        <Row style={{ marginBottom: '10px' }} onContextMenu={(e) => e.preventDefault()}>
          <Col span={24}>
            <Row>
              <img
                src={node.profile_image}
                alt={`پروفایل ${node.name}`}
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: '50%',
                  marginRight: 8,
                }}
              />
              <Space style={{ marginRight: '5px' }}>
                {node.name} {node.active ? '' : '(غیرفعال)'}
              </Space>
              <Dropdown
                overlay={renderMenu(node)} // استفاده از تابع renderMenu برای تولید منو
                trigger={['contextMenu']} // فعال کردن منو با راست کلیک
              >
                <span style={{ cursor: 'pointer' }}>...</span>
              </Dropdown>
            </Row>
          </Col>
          <Col
            span={24}
            style={{
              fontSize: '12px',
              color: '#555',
              marginRight: '47px',
            }}
          >
            {node.description}
          </Col>
        </Row>
      ),
      key: node.id,
      children: renderTree(node.children),
    }));
  };

  const renderMenu = (node: Node) => (
    <Menu>
      <Menu.Item onClick={() => toggleNodeStatus(node)}>{node.active ? 'غیرفعال کردن' : 'فعال کردن'}</Menu.Item>
    </Menu>
  );

  const resetForm = () => {
    setIsModalVisible(false);
  };

  const showModal = (node: Node) => {
    setIsModalVisible(true);
    form.setFieldsValue(node);
  };

  const onSelect = (keys: React.Key[]) => {
    if (keys[0]) {
      const node1: Node = {
        id: Number(keys[0]),
        name: `مدیر عامل ${keys[0]}`,
        description: 'شرح مدیر عامل',
        profile_image: '',
        parent_id: 2,
        active: true,
      };
      showModal(node1);
    }
  };

  const toggleNodeStatus = (node: Node) => {
    const updatedTree = treeData.map((item) => {
      if (item.id === node.id) {
        return { ...item, active: !item.active };
      }
      return item;
    });
    setTreeData(updatedTree);
    message.success(`وضعیت نود ${node.name} تغییر کرد!`);
  };

  return (
    <>
      <Tree showLine treeData={renderTree(treeData)} onSelect={onSelect} defaultExpandAll />
      <Modal
        title="اطلاعات نود انتخابی"
        footer={null}
        open={isModalVisible}
        okButtonProps={{ hidden: true }}
        onCancel={() => {
          resetForm();
        }}
      >
        <Form form={form}>
          <FormItem name="name">
            <Input readOnly />
          </FormItem>
        </Form>
      </Modal>
    </>
  );
};

export default TreeComponent;

// import React, { useEffect, useState } from "react";
// import { Col, Form, Input, Modal, Row, Space, Tree } from "antd";
// import "./TreeNode.css";
// import FormItem from "antd/es/form/FormItem";

// type Node = {
//   id: number;
//   name: string;
//   description: string;
//   profile_image: string;
//   parent_id: number | null;
// };

// const TreeComponent: React.FC = () => {
//   const [treeData, setTreeData] = useState<any[]>([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [form] = Form.useForm<Node>();

//   const fetchData = () => {
//     const nodes: Node[] = [];
//     for (let i = 1; i <= 20; i++) {
//       nodes.push({
//         id: i,
//         name: `مدیرعامل ${i}`,
//         description: `شرح نود ${i}`,
//         profile_image:
//           "https://bizgo.ir/Portals/0/DNNGalleryPro/uploads/2024/1/6/home-slider.jpg",
//         parent_id: i > 1 && i <= 16 ? Math.floor(i / 2) : null, // هر دو نود فرزند یک نود والد هستند
//       });
//     }
//     nodes.push({
//       id: 30,
//       name: `مدیرعامل ${30}`,
//       description: ``,
//       profile_image: "https://via.placeholder.com/30",
//       parent_id: 17,
//     });
//     nodes.push({
//       id: 30,
//       name: `مدیرعامل ${30}`,
//       description: `شرح نود ${30}`,
//       profile_image: "https://via.placeholder.com/30",
//       parent_id: 18,
//     });
//     const structuredData = buildTree(nodes);
//     setTreeData(structuredData);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const buildTree = (nodes: Node[]) => {
//     const tree: any = [];
//     const lookup: { [key: number]: any } = {};

//     nodes.forEach((node) => {
//       lookup[node.id] = { ...node, children: [] };
//     });

//     nodes.forEach((node) => {
//       if (node.parent_id === null) {
//         tree.push(lookup[node.id]);
//       } else {
//         lookup[node.parent_id].children.push(lookup[node.id]);
//       }
//     });

//     return tree;
//   };

//   const renderTree = (data: any[]): any[] => {
//     return data.map((node) => ({
//       title: (
//         <Row style={{ marginBottom: "10px" }}>
//           <Col span={24}>
//             <Row>
//               <img
//                 src={node.profile_image}
//                 alt={`پروفایل ${node.name}`}
//                 style={{
//                   width: 35,
//                   height: 35,
//                   borderRadius: "50%",
//                   marginRight: 8,
//                 }}
//               />
//               <Space style={{ marginRight: "5px" }}>{node.name}</Space>
//             </Row>
//           </Col>
//           <Col
//             span={24}
//             style={{
//               fontSize: "12px",
//               // marginTop: "4px",
//               color: "#555",
//               marginRight: "47px",
//             }}
//           >
//             {node.description}
//           </Col>
//         </Row>
//       ),
//       key: node.id,
//       children: renderTree(node.children),
//     }));
//   };

//   const resetForm = () => {
//     setIsModalVisible(false);
//   };

//   const showModal = (node: Node) => {
//     setIsModalVisible(true);
//   };

//   const onSelect = (keys: React.Key[]) => {
//     if (keys[0]) {
//       const node1: Node = {
//         id: Number(keys[0]),
//         name: `مدیر عامل ${keys[0]}`,
//         description: "شرح مدیر عامل",
//         profile_image: "",
//         parent_id: 2,
//       };
//       showModal(node1);
//       form.setFieldsValue(node1);
//     }
//   };

//   return (
//     <>
//       <Tree
//         showLine
//         treeData={renderTree(treeData)}
//         onSelect={onSelect}
//         defaultExpandAll
//       />
//       <Modal
//         title="اطلاعات نود انتخابی"
//         footer={null}
//         open={isModalVisible}
//         okButtonProps={{ hidden: true }}
//         onCancel={() => {
//           resetForm();
//         }}
//       >
//         <Form form={form}>
//           <FormItem name="name">
//             <Input readOnly />
//           </FormItem>
//         </Form>
//       </Modal>{" "}
//     </>
//   );
// };

// export default TreeComponent;
