import React from 'react'
import { Tabs } from '@mantine/core';
import Brands from '../../components/container/brand/Brands';
import Models from '../../components/container/model/Models';

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
      component: <div>Customer</div>
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