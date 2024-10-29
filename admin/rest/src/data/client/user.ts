import {
  AuthResponse,
  User,
  ChangePasswordInput,
  ForgetPasswordInput,
  VerifyForgetPasswordTokenInput,
  MakeAdminInput,
  BlockUserInput,
  WalletPointsInput,
  QueryOptionsType,
  UserPaginator,
  UserQueryOptions,
  Shop,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { HttpClient } from './http-client';
import {
  LoginDto,
  CreateUserDto,
  ResetPasswordDto,
} from 'shop-shared/dist/auth';
import { UpdateProfileDto } from 'shop-shared/dist/users';

export const userClient = {
  me: () => {
    return HttpClient.get<User>(API_ENDPOINTS.ME);
  },
  login: (variables: LoginDto) => {
    return HttpClient.post<AuthResponse>(API_ENDPOINTS.TOKEN, variables);
  },
  logout: () => {
    return HttpClient.post<any>(API_ENDPOINTS.LOGOUT, {});
  },
  register: (variables: CreateUserDto) => {
    return HttpClient.post<AuthResponse>(API_ENDPOINTS.REGISTER, variables);
  },
  update: (payload: UpdateProfileDto) => {
    return HttpClient.put<User>(API_ENDPOINTS.PROFILE, payload);
  },
  changePassword: (variables: ChangePasswordInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.CHANGE_PASSWORD, variables);
  },
  forgetPassword: (variables: ForgetPasswordInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.FORGET_PASSWORD, variables);
  },
  verifyForgetPasswordToken: (variables: VerifyForgetPasswordTokenInput) => {
    return HttpClient.post<any>(
      API_ENDPOINTS.VERIFY_FORGET_PASSWORD_TOKEN,
      variables
    );
  },
  resetPassword: (variables: ResetPasswordDto) => {
    return HttpClient.post<any>(API_ENDPOINTS.RESET_PASSWORD, variables);
  },
  makeAdmin: (variables: MakeAdminInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.MAKE_ADMIN, variables);
  },
  block: (variables: BlockUserInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.BLOCK_USER, variables);
  },
  unblock: (variables: BlockUserInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.UNBLOCK_USER, variables);
  },
  addWalletPoints: (variables: WalletPointsInput) => {
    return HttpClient.post<any>(API_ENDPOINTS.ADD_WALLET_POINTS, variables);
  },
  fetchUsers: ({ name, ...params }: Partial<UserQueryOptions>) => {
    return HttpClient.get<UserPaginator>(API_ENDPOINTS.USERS, {
      searchJoin: 'and',
      with: 'wallet',
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
  fetchOwners: () => {
    return HttpClient.get<User[]>(API_ENDPOINTS.OWNERS);
  },
  fetchAdmins: ({ ...params }: Partial<UserQueryOptions>) => {
    return HttpClient.get<UserPaginator>(API_ENDPOINTS.ADMIN_LIST, {
      searchJoin: 'and',
      ...params,
    });
  },
  fetchUser: ({ id }: { id: string }) => {
    return HttpClient.get<User>(`${API_ENDPOINTS.USERS}/${id}`);
  },
  resendVerificationEmail: () => {
    return HttpClient.post<any>(API_ENDPOINTS.SEND_VERIFICATION_EMAIL, {});
  },
  updateEmail: ({ email }: { email: string }) => {
    return HttpClient.post<any>(API_ENDPOINTS.UPDATE_EMAIL, { email });
  },
  fetchShop: () => {
    return HttpClient.get<Shop>(API_ENDPOINTS.SHOPS_OWNER);
  },
};
