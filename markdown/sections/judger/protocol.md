# 协议

## 连接协议

评测机通过 Socket.IO 连接到评测系统，并以此交换数据。

### 连接

连接前，「开发者」权限的用户可以在前端获取服务器密钥 `secret`（一个长度为 32 的随机字符串），并保存下来。

评测机连接在线测评系统时，使用 `judger:connect` 事件。事件会携带评测机的基本信息，包含 `judgerId` 和服务器密钥 `secret`。

系统收到连接请求后，会先验证密钥是否正确。如果密钥正确，则连接成功，并返回 `judger:connect:success` 事件。如果密钥不正确，则连接失败，并返回 `judger:connect:error` 事件。

### 心跳

评测机在连接成功后，需要每 10 秒发送一次心跳包，以保持连接状态。心跳包使用 `judger:ping` 事件。

心跳包需要包含评测机当前的 CPU 和内存使用情况。服务器应当记录并公开显示。

### 评测

评测机在连接成功后，可以接收系统发送的评测任务。评测任务使用 `judger:judge` 事件。

评测任务包含评测信息。

```json
{
    "taskId": <string>,
    "type": "traditional" | "submit-answer" | "interact" |
            "custom-test" | "compile",
    "timeLimit": <number>,
    "memoryLimit": <number>,
    "data": <binary data>,
    "returnFiles": ["foo", "bar"]
}
```

### 传统题

传统题指的是 `type` 为 `traditional` 的评测任务。

评测机收到的 `data` 大概目录如下：

```
data
├── data.in
├── something_else.txt (可选)
├── data.ans
├── foo
└── jury
```

### 提交答案题

提交答案题指的是 `type` 为 `submit-answer` 的评测任务。

```
data
├── data.ans
├── data.out
└── jury
```

### 交互题

交互题指的是 `type` 为 `interact` 的评测任务。

**注意：** 这里的交互题指的是 stdio 交互。Grader 交互将会在编译的时候转换为传统评测任务。

```
data
├── data.in
├── data.ans
├── foo (用户程序)
├── bar (来自 interact.cpp)
└── jury
```

### 自定义测试

自定义测试指的是 `type` 为 `custom-test` 的评测任务。

```
data
├── data.in
└── foo
```

### 编译任务

编译任务指的是 `type` 为 `compile` 的评测任务。

```
data
├── grader.h (可选)
├── base.cpp (可选)
└── code.cpp
```

### 评测结果

评测结果使用 `judger:result` 事件。

```json
{
    "taskId": <uuid string>,
    "result": "Ok" | "Wrong Answer" | "Presentation Error" | "Partially Correct" | "Fail" | "Runtime Error" | "Time Limit Exceeded" | "Memory Limit Exceeded" | "Output Limit Exceeded" | "Compile Error" | "System Error",
    "data": <binary data>,
    "score": <number>,
    "message": <string>,
}
```

特殊地，返回时会通过 `data` 返回 `returnFiles` 所要求的文件。

## 数据协议

用户上传的数据将会为以下结构储存：

```
data
├── testdata
│   ├── 1.in
│   ├── 1.ans
│   ├── 2.in
│   ├── 2.ans
│   └── ...
├── jury.cpp
├── grader.h
└── config.json
```

`config.json` 包含题目基本信息，如下：

```json
{
    "type": "traditional" | "submit-answer" | "interact",

    "timeLimit": <number>,
    "memoryLimit": <number>,

    "data": [
        {
            "input": "1.in",
            "output": "1.ans",
            "score": 10,
            "subtask": 1
        },
        {
            "input": "2.in",
            "output": "2.ans",
            "score": 20,
            "subtask": 1,
            "timeLimit": <number>,
            "memoryLimit": <number>
        },
        ...
    ],

    "subtasks": [
        {
            "id": 1,
            "score": 30,
            "type": "min" | "max" | "sum" | "mul",
            "depends": []
        },
        ...
    ],

    "grader": "grader.h",
    "base": "base.cpp",
    "interact": "interact.cpp",
    "checker": "checker.cpp" | "fcmp" | "wcmp" | "acmp" | "ncmp" | ...,
    "assets": ["asset1", "asset2", ...]
}
```
