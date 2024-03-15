import { NextPage } from 'next'

interface Props {
  params: {
    owner: string
  }
}

const Page: NextPage<Props> = ({ params }) => {
  return <h1>owner is {params.owner}</h1>
}

export default Page
