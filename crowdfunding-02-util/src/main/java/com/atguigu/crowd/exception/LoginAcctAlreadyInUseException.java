package com.atguigu.crowd.exception;

/**
 * @Author ：DENGQI
 * @Class ： 保存或更新Admin时如果检测到登录账号重复抛出这个异常
 * @Create ：2020-03-17 15:39 :星期二
 */
public class LoginAcctAlreadyInUseException extends RuntimeException {
    public static final long serialVersionUID = 1L;
    public LoginAcctAlreadyInUseException() {
        super();

    }

    public LoginAcctAlreadyInUseException(String message) {
        super(message);
    }

    public LoginAcctAlreadyInUseException(String message, Throwable cause) {
        super(message, cause);
    }

    public LoginAcctAlreadyInUseException(Throwable cause) {
        super(cause);
    }

    public LoginAcctAlreadyInUseException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
