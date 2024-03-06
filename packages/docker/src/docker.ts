import axios, { Axios } from 'axios'
import {
  DockerListContainerResult,
  DockerListContainersResult,
  DockerOptions
} from './types'

export class DockerClient {
  private axios: Axios
  private socketPath: string

  public constructor({ socketPath }: DockerOptions) {
    this.socketPath = socketPath

    this.axios = axios.create({ baseURL: 'http://localhost' })
  }

  public async getAllContainers(
    all?: boolean,
    limit?: number,
    filters?: Map<string, Array<string>>
  ): Promise<Array<DockerListContainer>> {
    const res = await this.axios.get('/containers/json', {
      socketPath: this.socketPath,
      params: {
        all,
        limit,
        filters
      }
    })

    return res.data.map((data: DockerListContainerResult) => {
      return new DockerListContainer(data)
    })
  }

  public async getContainerById(id: string) {
    const containers = await this.getAllContainers(true)

    return containers.find((container) => container.getId() === id)
  }

  public async getContainerByName(name: string) {
    const containers = await this.getAllContainers(true)

    return containers.find((container) => container.getName() === name)
  }
}

class DockerListContainer {
  data: DockerListContainerResult

  constructor(data: DockerListContainerResult) {
    this.data = data
  }

  public getId(): string {
    return this.data.Id
  }

  public getName(): string {
    let name = this.data.Names[0]?.replace('/', '')

    if (!name) {
      name = ''
    }

    return name
  }

  public getPorts() {
    return this.data.Ports.map((port) => ({
      public: port.PublicPort,
      private: port.PrivatePort,
      type: port.Type
    }))
  }

  public getState() {
    return this.data.State
  }

  public getNetworks() {
    return this.data.NetworkSettings.Networks
  }

  public getMounts() {
    return this.data.Mounts.map((mount) => ({
      destination: mount.Destination,
      driver: mount.Driver,
      mode: mount.Mode,
      name: mount.Name,
      propagation: mount.Propagation,
      rw: mount.RW,
      source: mount.Source
    }))
  }

  public getCreatedAt() {
    return this.data.Created
  }

  public getImage() {
    return this.data.Image
  }

  public getLabels() {
    return this.data.Labels
  }
}
