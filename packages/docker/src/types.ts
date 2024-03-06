export type DockerOptions = {
  socketPath: string
}

export type DockerListContainersResult = Array<{
  Id: string
  Names: Array<string>
  Image: string
  ImageID: string
  Command: string
  Created: number
  State: string
  Status: string
  Ports: Array<{
    PrivatePort: number
    PublicPort: number
    Type: string
  }>
  Labels: Record<string, string>
  SizeRw: number
  SizeRootFs: number
  HostConfig: Record<string, string>
  NetworkSettings: {
    Networks: {
      bridge: {
        NetworkID: string
        EndpointID: string
        Gateway: string
        IPAddress: string
        IPPrefixLen: number
        IPv6Gateway: string
        GlobalIPv6Address: string
        GlobalIPv6PrefixLen: number
        MacAddress: string
      }
    }
  }
  Mounts: Array<{
    Name: string
    Source: string
    Destination: string
    Driver: string
    Mode: string
    RW: boolean
    Propagation: string
  }>
}>

export type DockerListContainerResult = DockerListContainersResult[number]
