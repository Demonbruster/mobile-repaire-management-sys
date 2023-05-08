import React from 'react'
import { Tabs } from '@mantine/core';
import Brands from '../../components/container/brand/Brands';
import Models from '../../components/container/model/Models';
import Customers from '../../components/container/customer/Customers';

function Page() {
  const tabs = [
    {
      name: "Brand",
      component: <Brands />
    },
    {
      name: "Model",
      component: <Models />
    },
    {
      name: "Customer",
      component: <Customers/>
    }
  ];

  return (
    <>
      <Tabs variant="outline" defaultValue="Brand">
        <Tabs.List>
          {tabs.map((tab) => (
            <Tabs.Tab value={tab.name} key={tab.name}>
              {tab.name}
            </Tabs.Tab>
          ))}
        </Tabs.List>
        {tabs.map((tab,index) => (
          <Tabs.Panel value={tab.name} pt='xs' key={tab.name+index}>
            {tab.component}
          </Tabs.Panel>
        ))}
      </Tabs>
    </>
  )
}

export default Page