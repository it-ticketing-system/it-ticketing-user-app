interface UserTicketDepartmentDto {
  id: number;
  name: string;
}

export type UserTicketStatusDto =
  'OPEN' | 'IN_PROGRESS' | 'WAITING_FOR_USER' | 'RESOLVED' | 'CLOSED';

export interface UserTicketListItemDto {
  id: number;
  ticketNumber: string;
  title: string;
  department: UserTicketDepartmentDto;
  status: UserTicketStatusDto;
  lastUpdatedAt: string;
}

export interface GetMyTicketsRequestDto {
  page?: number;
  perPage?: number;
  status?: UserTicketStatusDto;
  search?: string;
  departmentId?: number;
  from?: string;
  to?: string;
}

export interface CreateTicketRequestDto {
  title: string;
  departmentId: number;
  initialMessage: string;
  fileIds: number[];
}

interface TicketSupportDto {
  id: number;
  name: string;
}

interface TicketFileDto {
  id: number;
  originalName: string;
  mimeType?: string;
  size?: number;
  url: string;
}

interface TicketMessageSenderDto {
  id: number;
  name: string;
  username?: string;
  role: 'USER' | 'SUPPORT' | 'ADMIN';
  profileImageUrl: string | null;
}

export interface UserTicketMessageDto {
  id: number;
  body: string;
  sender: TicketMessageSenderDto;
  files: TicketFileDto[];
  createdAt: string;
}

interface CreatedTicketDto {
  id: number;
  ticketNumber: string;
  title: string;
  department: UserTicketDepartmentDto;
  status: UserTicketStatusDto;
  assignedSupport: TicketSupportDto | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketResponseDto {
  ticket: CreatedTicketDto;
  initialMessage: UserTicketMessageDto;
}

export interface UserTicketDetailsDto extends CreatedTicketDto {
  messages: UserTicketMessageDto[];
}

export interface SendTicketMessageRequestDto {
  body: string;
  fileIds: number[];
}

export type SendTicketMessageResponseDto = UserTicketMessageDto;
