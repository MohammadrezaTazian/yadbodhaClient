import React, { useEffect, useState } from 'react';
import { Col, Form, Input, Modal, Row, Space, Tree, Menu, message } from 'antd';
import './TreeNode.css';
import FormItem from 'antd/es/form/FormItem';
import { FamilyTreePersonModel } from '@/app/models/familyTree/FamilyTreePersonModel';
import { familyTreeServices } from '@/app/services/familyTreeServices';
import { errorByMessage } from '@/app/helper/ErrorHandler';

interface propsModel {
  familyTreeId: number;
}
const TreeComponent = (props: propsModel) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm<FamilyTreePersonModel>();
  const [isLoading, setIsLoading] = useState(false);
  // const router = useRouter();
  const [mainFamilyTreePersons, setMainFamilyTreePersons] = useState<FamilyTreePersonModel[]>([]);
  const [familyTreePersons, setFamilyTreePersons] = useState<FamilyTreePersonModel[]>([]);
  const [familyTreePerson, setFamilyTreePerson] = useState<FamilyTreePersonModel>();

  useEffect(() => {
    getFamilyTreePersonList();
  }, []);

  const getFamilyTreePersonList = async () => {
    try {
      setIsLoading(true);
      const result = await familyTreeServices.getFamilyTreePersonList(props.familyTreeId);
      if (result) {
        setMainFamilyTreePersons(result);
        const structuredData = buildTree(result);
        setFamilyTreePersons(structuredData);
        setIsLoading(false);
      }
    } catch (error) {
      errorByMessage(error);
      setIsLoading(false);
    }
  };

  const buildTree = (nodes: FamilyTreePersonModel[]) => {
    const tree: any = [];
    const lookup: { [key: number]: FamilyTreePersonModel & { children: any[] } } = {};

    nodes.forEach((node) => {
      lookup[node.familyTreePersonId] = { ...node, children: [] };
    });
    nodes.forEach((node) => {
      if (node.parentId === null) {
        tree.push(lookup[node.familyTreePersonId]);
      } else {
        lookup[node.parentId!].children.push(lookup[node.familyTreePersonId]);
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
                src={node.imageUrl}
                alt={`پروفایل ${node.familyTreePersonName}`}
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: '50%',
                  marginRight: 8,
                }}
              />
              <Space style={{ marginRight: '5px' }}>
                {node.familyTreePersonName} {node.isActive ? '' : '(غیرفعال)'}
              </Space>
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
            {node.wifeName}
          </Col>
        </Row>
      ),
      key: node.familyTreePersonId,
      children: renderTree(node.children),
    }));
  };

  const resetForm = () => {
    setIsModalVisible(false);
  };

  const showModal = (node: FamilyTreePersonModel) => {
    setIsModalVisible(true);
    form.setFieldsValue(node);
  };

  const onSelect = (keys: React.Key[]) => {
    if (keys[0]) {
      const personSelected: FamilyTreePersonModel[] = mainFamilyTreePersons.filter((node) => node.familyTreePersonId === keys[0]);
      const node1: FamilyTreePersonModel = {
        familyTreePersonId: Number(keys[0]),
        familyTreePersonName: personSelected ? personSelected[0].familyTreePersonName : '',
        wifeName: familyTreePerson?.wifeName,
        imageUrl: familyTreePerson ? familyTreePerson?.imageUrl : '',
        parentId: familyTreePerson?.parentId,
        isActive: familyTreePerson?.isActive,
        isDeceased: familyTreePerson ? familyTreePerson?.isDeceased : false,
        deceasedRemark: familyTreePerson && familyTreePerson.isDeceased === true ? 'فوت شده' : '',
      };
      showModal(node1);
    }
  };

  return (
    <>
      <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', width: '100%' }}>
        <Tree
          showLine
          treeData={renderTree(familyTreePersons)}
          onSelect={onSelect}
          defaultExpandAll
          style={{ padding: '10px', backgroundColor: 'rgba(215, 213, 213, 0.3)' }}
        />
      </div>
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
          <FormItem name="familyTreePersonName">
            <Input readOnly />
          </FormItem>
          <FormItem name="deceasedRemark">
            <Input readOnly />
          </FormItem>
        </Form>
      </Modal>
    </>
  );
};

export default TreeComponent;

// import React, { useEffect, useState } from 'react';
// import { Col, Form, Input, Modal, Row, Space, Tree, Menu, message } from 'antd';
// import './TreeNode.css';
// import FormItem from 'antd/es/form/FormItem';

// type Node = {
//   id: number;
//   name: string;
//   wifeName: string;
//   profile_image: string;
//   parentId: number | null;
//   active: boolean; // اضافه کردن فیلد برای فعال/غیرفعال کردن نود
// };
// interface propsModel {
//   familyTreeId: number;
// }
// export const TreeComponent = (props: propsModel) => {
//   const [treeData, setTreeData] = useState<Node[]>([]);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [form] = Form.useForm<Node>();

//   const fetchData = () => {
//     const nodes: Node[] = [];
//     for (let i = 1; i <= 18; i++) {
//       nodes.push({
//         id: i,
//         name: `جعفر ضیائی `,
//         wifeName: `فاطمه حق باطنی `,
//         profile_image: 'https://bizgo.ir/Portals/0/DNNGalleryPro/uploads/2024/1/6/home-slider.jpg',
//         parentId: i > 1 && i <= 16 ? Math.floor(i / 2) : null,
//         active: true,
//       });
//     }
//     console.log('nodes', nodes);
//     const structuredData = buildTree(nodes);
//     setTreeData(structuredData);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const buildTree = (nodes: Node[]) => {
//     const tree: any = [];
//     const lookup: { [key: number]: Node & { children: any[] } } = {};

//     nodes.forEach((node) => {
//       lookup[node.id] = { ...node, children: [] };
//     });

//     nodes.forEach((node) => {
//       if (node.parentId === null) {
//         tree.push(lookup[node.id]);
//       } else {
//         lookup[node.parentId].children.push(lookup[node.id]);
//       }
//     });

//     return tree;
//   };

//   const renderTree = (data: any[]): any[] => {
//     return data.map((node) => ({
//       title: (
//         <Row style={{ marginBottom: '10px' }} onContextMenu={(e) => e.preventDefault()}>
//           <Col span={24}>
//             <Row>
//               <img
//                 src={node.profile_image}
//                 alt={`پروفایل ${node.name}`}
//                 style={{
//                   width: 35,
//                   height: 35,
//                   borderRadius: '50%',
//                   marginRight: 8,
//                 }}
//               />
//               <Space style={{ marginRight: '5px' }}>
//                 {node.name} {node.active ? '' : '(غیرفعال)'}
//               </Space>
//               {/* <Dropdown
//                 overlay={renderMenu(node)} // استفاده از تابع renderMenu برای تولید منو
//                 trigger={['contextMenu']} // فعال کردن منو با راست کلیک
//               >
//                 <span style={{ cursor: 'pointer' }}>...</span>
//               </Dropdown> */}
//             </Row>
//           </Col>
//           <Col
//             span={24}
//             style={{
//               fontSize: '12px',
//               color: '#555',
//               marginRight: '47px',
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

//   const renderMenu = (node: Node) => (
//     <Menu>
//       <Menu.Item onClick={() => toggleNodeStatus(node)}>{node.active ? 'غیرفعال کردن' : 'فعال کردن'}</Menu.Item>
//     </Menu>
//   );

//   const resetForm = () => {
//     setIsModalVisible(false);
//   };

//   const showModal = (node: Node) => {
//     setIsModalVisible(true);
//     form.setFieldsValue(node);
//   };

//   const onSelect = (keys: React.Key[]) => {
//     if (keys[0]) {
//       const node1: Node = {
//         id: Number(keys[0]),
//         name: `مدیر عامل ${keys[0]}`,
//         wifeName: 'شرح مدیر عامل',
//         profile_image: '',
//         parentId: 2,
//         active: true,
//       };
//       showModal(node1);
//     }
//   };

//   const toggleNodeStatus = (node: Node) => {
//     const updatedTree = treeData.map((item) => {
//       if (item.id === node.id) {
//         return { ...item, active: !item.active };
//       }
//       return item;
//     });
//     setTreeData(updatedTree);
//     message.success(`وضعیت نود ${node.name} تغییر کرد!`);
//   };

//   return (
//     <>
//       <div style={{ overflowX: 'auto', whiteSpace: 'nowrap', width: '100%' }}>
//         <Tree
//           showLine
//           treeData={renderTree(treeData)}
//           onSelect={onSelect}
//           defaultExpandAll
//           style={{ padding: '10px', backgroundColor: 'rgba(215, 213, 213, 0.3)' }}
//         />
//       </div>
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
//       </Modal>
//     </>
//   );
// };

// export default TreeComponent;
