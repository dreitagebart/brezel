import { NextPage } from 'next'

interface Props {
  params: {
    owner: string
    name: string
  }
}

const Page: NextPage<Props> = ({ params }) => {
  return (
    <h1>
      owner and name is {params.owner}/{params.name}
    </h1>
  )
}

export default Page
