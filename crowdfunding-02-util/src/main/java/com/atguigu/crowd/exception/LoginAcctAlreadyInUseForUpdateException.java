package com.atguigu.crowd.exception;

/**
 * @Author ：DENGQI
 * @Class ：
 * @Create ：2020-03-17 15:57 :星期二
 */
public class LoginAcctAlreadyInUseForUpdateException extends RuntimeException{
    public static final long serialVersionUID = 1L;
    public LoginAcctAlreadyInUseForUpdateException() {
    }

    public LoginAcctAlreadyInUseForUpdateException(String message) {
        super(message);
    }

    public LoginAcctAlreadyInUseForUpdateException(String message, Throwable cause) {
        super(message, cause);
    }

    public LoginAcctAlreadyInUseForUpdateException(Throwable cause) {
        super(cause);
    }

    public LoginAcctAlreadyInUseForUpdateException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
        super(message, cause, enableSuppression, writableStackTrace);
    }
}
