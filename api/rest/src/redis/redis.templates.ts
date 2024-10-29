export const forgetKey = (email: string, token: string) => {

}
class RedisTemplate {
  private static FORGET_PASSWORD_TEMPLATE = '_FORGET_PASSWORD_';
  private static UPPLOAD_TEMPLATE = '_UPLOAD_IMAGE_';
  private static UPPLOAD_COUPON_IMAGE = '_COUPON_IMAGE_';

  static buildForgetPasswordKey(email: string = '*', token: string = '*') {
    return `${email}${this.FORGET_PASSWORD_TEMPLATE}${token}`.toUpperCase();
  }

  static buildUploadImageKey(userId: string | number = '*') {
    return `u${userId}${this.UPPLOAD_TEMPLATE}`.toUpperCase();
  }

  static buildCouponImageKey(userId: string | number = '*', couponId: string | number = '*') {
    return `u${userId}${this.UPPLOAD_COUPON_IMAGE}${couponId}`.toUpperCase();

  }
}

export default RedisTemplate;