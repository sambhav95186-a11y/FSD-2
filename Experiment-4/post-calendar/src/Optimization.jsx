import { memo } from "react";

function Optimization({
  useMemoEnabled,
  setUseMemoEnabled,
  useCallbackEnabled,
  setUseCallbackEnabled,
  reactMemoEnabled,
  setReactMemoEnabled,
}) {
  return (
    <section className="optimization-card">

      <div className="optimization-header">

        <div>
          <h2>Optimization Techniques</h2>

          <p>
            Enable or disable React optimization
            techniques for performance comparison.
          </p>
        </div>

      </div>


      <div className="optimization-options">

        {/* useMemo */}

        <div className="optimization-option">

          <div className="optimization-info">

            <strong>useMemo</strong>

            <span>
              Memoizes calculated calendar data
            </span>

          </div>

          <button
            className={`toggle ${
              useMemoEnabled ? "active" : ""
            }`}
            onClick={() =>
              setUseMemoEnabled(
                !useMemoEnabled
              )
            }
          >
            <span></span>

            {useMemoEnabled
              ? "ON"
              : "OFF"}
          </button>

        </div>


        {/* useCallback */}

        <div className="optimization-option">

          <div className="optimization-info">

            <strong>useCallback</strong>

            <span>
              Keeps callback functions stable
            </span>

          </div>

          <button
            className={`toggle ${
              useCallbackEnabled ? "active" : ""
            }`}
            onClick={() =>
              setUseCallbackEnabled(
                !useCallbackEnabled
              )
            }
          >
            <span></span>

            {useCallbackEnabled
              ? "ON"
              : "OFF"}
          </button>

        </div>


        {/* React.memo */}

        <div className="optimization-option">

          <div className="optimization-info">

            <strong>React.memo</strong>

            <span>
              Prevents unnecessary component renders
            </span>

          </div>

          <button
            className={`toggle ${
              reactMemoEnabled ? "active" : ""
            }`}
            onClick={() =>
              setReactMemoEnabled(
                !reactMemoEnabled
              )
            }
          >
            <span></span>

            {reactMemoEnabled
              ? "ON"
              : "OFF"}
          </button>

        </div>

      </div>


      <div className="optimization-status">

        <span className="status-dot"></span>

        {useMemoEnabled ||
        useCallbackEnabled ||
        reactMemoEnabled
          ? "Optimization enabled"
          : "All optimizations disabled"}

      </div>

    </section>
  );
}

export default memo(Optimization);