import 'graphql-import-node';
import { buildSchema } from 'graphql';
// import { buildASTSchema } from 'graphql';
// import schema from './schema.graphql';

// const gqlSchema = buildASTSchema(schema);

// Need to import the schema that way because ncc cannot parse .graphql files
const gqlSchema = buildSchema(`
scalar PostFields

type Version {
  id: ID!
  name: String!
  lastModified: String!
  size: Int!
  path: String!
}

type File {
  id: ID
  name: String!
  lastModified: String!
  size: Int!
  path: String!
  versions: [Version!]
}

type FileList {
  list: [File!]!
}

type SignedUrl {
  url: String!
}

type SignedPost {
  url: String!
  fields: PostFields!
}

type FileName {
  name: String!
}

type FileNameList {
  names: [String!]!
}

type VersionId {
  id: ID!
}

type Directory {
  name: String!
  path: String!
  bucketName: String
}

type TextFileContent {
  content: String!
}

"Deprecated"
type VersionControlSuccess {
  message: String!
}

"ERROR TYPES"
type Unauthenticated {
  message: String!
}

type Unauthorized {
  message: String!
}

type StorageNotFound {
  message: String!
}

type FileNotFound {
  message: String!
}

type WrongFileType {
  message: String!
}

type ServerError {
  message: String!
  stack: String
}


"INPUT TYPES"
input ListInput {
  path: String!
  root: String
  bucketName: String
}

input UploadInput {
  fileName: String!
  fileType: String!
  path: String!
  root: String
  bucketName: String
}

input FileInput {
  fileName: String!
  path: String!
  root: String
  versionId: String
  bucketName: String
}

input FilesInput {
  fileNames: [String!]!
  path: String!
  root: String
  versionIds: [String!]
  bucketName: String
}

input DirectoryInput {
  path: String!
  root: String
  bucketName: String
}

input VersionControlInput {
  bucketName: String!
  fileName: String!
  root: String!
  maxVersionsNumber: Int!
}

union ListBucketResult =
    FileList
  | Unauthenticated
  | Unauthorized
  | StorageNotFound
  | ServerError

union SignedUrlResult =
    SignedUrl
  | SignedPost
  | Unauthenticated
  | Unauthorized
  | StorageNotFound
  | FileNotFound
  | ServerError

union TextFileContentResult =
    TextFileContent
  | Unauthenticated
  | Unauthorized
  | StorageNotFound
  | FileNotFound
  | WrongFileType
  | ServerError

union DeleteFileResult =
    FileName
  | FileNameList
  | Unauthenticated
  | Unauthorized
  | StorageNotFound
  | FileNotFound
  | ServerError

union DeleteDirectoryResult =
    Directory
  | Unauthenticated
  | Unauthorized
  | StorageNotFound
  | FileNotFound
  | ServerError

union RestoreFileResult =
    VersionId
  | Unauthenticated
  | Unauthorized
  | StorageNotFound
  | FileNotFound
  | ServerError

union VersionControlResult =
    VersionControlSuccess
  | Unauthenticated
  | StorageNotFound
  | FileNotFound
  | ServerError

type Queries {
  listBucketContent(listInput: ListInput!): ListBucketResult!
  getUploadUrl(uploadInput: UploadInput!): SignedUrlResult!
  getDownloadUrl(fileInput: FileInput!): SignedUrlResult!
  getTextFileContent(fileInput: FileInput!): TextFileContentResult
}

type Mutations {
  deleteOneFile(fileInput: FileInput!): DeleteFileResult
  deleteManyFiles(filesInput: FilesInput!): DeleteFileResult
  deleteDirectory(directoryInput: DirectoryInput): DeleteDirectoryResult
  restoreFileVersion(fileInput: FileInput!): RestoreFileResult
  controlVersions(versionControlInput: VersionControlInput!): VersionControlResult
}
schema {
  query: Queries
  mutation: Mutations
}
`);

export default gqlSchema;
