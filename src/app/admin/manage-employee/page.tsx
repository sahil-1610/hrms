import DeleteEmployee from '@/components/admin/DeleteEmployee'
import DefaultLayout from '@/components/Layouts/DefaultLayout'
import React from 'react'

function ManageEmployee() {
  return (
    <DefaultLayout>
      <DeleteEmployee/>
    </DefaultLayout>
  )
}

export default ManageEmployee